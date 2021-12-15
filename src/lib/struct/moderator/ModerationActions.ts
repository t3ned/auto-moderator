import {
  ModerationBase,
  ModerationLog,
  ModlogWithPendingAction,
  ModlogReason,
  dangerEmbed
} from "#lib";

import type { Guild, User, GuildMember } from "discord.js";
import { ModlogCaseType } from "@prisma/client";
import { parseMS } from "human-ms";

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
  ): Promise<ModlogWithPendingAction> {
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
  ): Promise<ModlogWithPendingAction> {
    if (!member.kickable) throw new Error("Member is not kickable");

    await member.kick();

    return new ModerationLog(member.guild, moderator, member.user, {
      caseType: ModlogCaseType.KICK,
      reason: reason
    }).new();
  }

  // public mute() {}
  // public unmute() {}

  /**
   * Bans a user
   * @param guild The guild
   * @param user The offending user
   * @param moderator The responsible moderator
   * @param reason The reason for this ban
   * @param days The number of message days to delete
   * @param duration The duration of this ban
   */
  public async ban(
    guild: Guild,
    user: User,
    moderator: User,
    reason: ModlogReason,
    days: number,
    duration?: number
  ): Promise<ModlogWithPendingAction> {
    const member = await this.manager.utils.fetchMember(guild, user.id);
    if (!member?.bannable) throw new Error("Member is not bannable");

    await this.manager.utils.tryDm(user.id, {
      embeds: [
        dangerEmbed(this.manager.utils.getReasonString(reason)).setAuthor(
          `Banned ${duration ? `for ${parseMS(duration)}` : ""}`
        )
      ]
    });

    await guild.members.ban(user, { days });

    return new ModerationLog(
      guild,
      moderator,
      user,
      {
        caseType: ModlogCaseType.BAN,
        reason: reason
      },
      duration
    ).new();
  }

  /**
   * Unbans a user
   * @param guild The guild
   * @param userId The offending user id
   * @param moderator The responsible moderator
   * @param reason The reason for this unban
   */
  public async unban(
    guild: Guild,
    userId: string,
    moderator: User,
    reason: ModlogReason
  ): Promise<ModlogWithPendingAction> {
    const ban = await this.manager.utils.fetchBan(guild, userId);
    if (!ban) throw "User is not banned";

    await guild.members.unban(userId);

    return new ModerationLog(guild, moderator, ban.user, {
      caseType: ModlogCaseType.UNBAN,
      reason: reason
    }).new();
  }

  /**
   * Performs the reverse action on a modlog
   * @param modlogId The id of the modlog
   * @param reason The reason the action was reversed
   */
  public async reverse(
    modlogId: string,
    reason: ModlogReason
  ): Promise<ModlogWithPendingAction> {
    const modlog = await this.manager.history.find(modlogId);
    if (!modlog) throw new Error("Modlog not found.");

    const guild = this.client.guilds.cache.get(modlog.guildId);
    if (!guild) throw new Error("Guild not found.");

    const moderator = await this.manager.utils.fetchUser(modlog.moderatorId);
    if (!moderator) throw new Error("Moderator not found.");

    switch (modlog.caseType) {
      case ModlogCaseType.BAN:
        return this.unban(guild, modlog.offenderId, moderator, reason);
    }

    throw new Error("Modlog is not reversible");
  }
}
