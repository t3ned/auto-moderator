import type {
  Guild,
  User,
  GuildBan,
  GuildMember,
  Message,
  MessageOptions
} from "discord.js";

import { ModerationBase, ModlogReason, ModlogReasons } from "#lib";

export class ModerationUtils extends ModerationBase {
  /**
   * Fetches a user
   * @param userId The id of the user
   */
  public fetchUser(userId: string): Promise<User | null> {
    return this.client.users.fetch(userId).catch(() => null);
  }

  /**
   * Fetches a member
   * @param guild The guild
   * @param userId The id of the user
   */
  public fetchMember(guild: Guild, userId: string): Promise<GuildMember | null> {
    return guild.members.fetch(userId).catch(() => null);
  }

  /**
   * Fetches a user's ban
   * @param guild The guild
   * @param userId The id of the user
   */
  public fetchBan(guild: Guild, userId: string): Promise<GuildBan | null> {
    return guild.bans.fetch(userId).catch(() => null);
  }

  /**
   * Tries to send a DM to a user
   * @param userId The id of the user
   * @param content The message content
   */
  public async tryDm(userId: string, content: MessageOptions): Promise<Message | null> {
    const user = await this.fetchUser(userId).catch(() => null);
    if (!user) return null;
    return user.send(content).catch(() => null);
  }

  /**
   * Gets the modlog reason string from the reason integer
   * @param reason The modlog reason integer
   */
  public getReasonString(reason: ModlogReason): string {
    return ModlogReasons[reason];
  }
}
