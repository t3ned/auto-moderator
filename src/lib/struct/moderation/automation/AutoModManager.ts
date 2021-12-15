import { ModerationManager, AutoModChecker, AutoModCheckerType } from "#lib";
import type { Message } from "discord.js";
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
    if (message.partial) await message.fetch();
    if (!message.guild || message.author.bot) return;

    for (const checker of this.messageCheckers) {
      const abortRest = await checker.run(message);
      if (abortRest) break;
    }
  }
}
