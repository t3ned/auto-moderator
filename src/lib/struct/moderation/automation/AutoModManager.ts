import {
  ModerationManager,
  AutoModChecker,
  AutoModCheckerType,
  databaseProvider
} from "#lib";

import type { GuildMember, Message } from "discord.js";
import * as checkers from "./checkers";

export class AutoModManager {
  /**
   * The manager instance
   */
  public manager!: ModerationManager;

  /**
   * The automod checkers
   */
  public checkers: AutoModChecker[];

  /**
   * The automod message checkers
   */
  public messageCheckers: AutoModChecker[];

  /**
   * The automod member join checkers
   */
  public memberJoinCheckers: AutoModChecker[];

  /**
   * @param manager The manager instance
   */
  public constructor(manager: ModerationManager) {
    Reflect.defineProperty(this, "manager", { value: manager });

    this.checkers = Object.values(checkers)
      .map((checker) => new checker(this))
      .sort((a, b) => b.priority - a.priority);

    this.messageCheckers = this.checkers.filter(
      (checker) => checker.type === AutoModCheckerType.Message
    );

    this.memberJoinCheckers = this.checkers.filter(
      (checker) => checker.type === AutoModCheckerType.GuildMemberAdd
    );
  }

  /**
   * Initialises all the helpers
   */
  public async init(): Promise<void> {
    // noop
  }

  /**
   * Runs the message checkers
   * @param message The message to check
   */
  public async runMessageCheckers(message: Message): Promise<void> {
    if (!message.guildId) return;

    const enabledModules = await this.getEnabledAutomodModules(message.guildId);
    const modules = this.messageCheckers.filter((x) => enabledModules.includes(x.name));

    for (const checker of modules) {
      const abortRest = await checker.run(message);
      if (abortRest) break;
    }
  }

  /**
   * Runs the member checkers
   * @param member The member to check
   */
  public async runMemberJoinCheckers(member: GuildMember): Promise<void> {
    const enabledModules = await this.getEnabledAutomodModules(member.guild.id);
    const modules = this.memberJoinCheckers.filter((x) =>
      enabledModules.includes(x.name)
    );

    for (const checker of modules) {
      const abortRest = await checker.run(member);
      if (abortRest) break;
    }
  }

  public getEnabledAutomodModules(guildId: string) {
    return databaseProvider.helpers.getEnabledAutomodModules(guildId);
  }
}
