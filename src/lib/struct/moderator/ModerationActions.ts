import {
  ModerationBase,
  ModerationLog,
  ModlogWithTask,
  ModlogReason,
  dangerEmbed
} from "#lib";

import type { GuildMember, User } from "discord.js";
import { ModlogCaseType } from "@prisma/client";

export class ModerationActions extends ModerationBase {
  /**
   * Warns a member
   * @param member The offending member
   * @param moderator The responsible moderator
   * @param reason The reason for this warning
   */
  public async warn(
    member: GuildMember,
    moderator: User,
    reason: ModlogReason
  ): Promise<ModlogWithTask> {
    await this.manager.utils.tryDm(member.id, {
      embeds: [
        dangerEmbed(this.manager.utils.getReasonString(reason)).setAuthor("Warning")
      ]
    });

    return new ModerationLog(member.guild, moderator, member.user, {
      caseType: ModlogCaseType.WARN,
      reason: reason
    }).new();
  }

  /**
   * Kicks a member
   * @param member The offending member
   * @param moderator The responible moderator
   * @param reason The reason for this kick
   */
  public async kick(
    member: GuildMember,
    moderator: User,
    reason: ModlogReason
  ): Promise<ModlogWithTask> {
    if (!member.kickable) throw new Error("Member is not kickable");

    await member.kick();

    return new ModerationLog(member.guild, moderator, member.user, {
      caseType: ModlogCaseType.KICK,
      reason: reason
    }).new();
  }

  // public mute() {}
  // public unmute() {}
  // public ban() {}
  // public unban() {}
}
