import {
  AutoModChecker,
  AutoModCheckerType,
  AutoModCheckerPriority,
  ModlogReason
} from "#lib";

import type { Guild, Message, User } from "discord.js";

export class AntiPhishing extends AutoModChecker {
  /**
   * The type of this checker
   */
  public type = AutoModCheckerType.Message;

  /**
   * The priority of this checker
   */
  public priority = AutoModCheckerPriority.Low;

  /**
   * Checks the message for phishing links
   */
  public async run(message: Message): Promise<boolean> {
    const embed = message.embeds.find((embed) => embed.type === "rich");
    if (!embed) return false;

    await this.mod.actions
      .ban(
        message.guild as Guild,
        message.author,
        this.client.user as User,
        ModlogReason.SELFBOT,
        1
      )
      .catch(() => null);

    return true;
  }
}
