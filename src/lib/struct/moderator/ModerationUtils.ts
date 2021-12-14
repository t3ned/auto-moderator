import type { User, Message, MessageOptions } from "discord.js";
import { ModerationBase } from "#lib";

export class ModerationUtils extends ModerationBase {
  /**
   * Fetches a user
   * @param userId The id of the user
   */
  public async fetchUser(userId: string): Promise<User | null> {
    try {
      return this.client.users.fetch(userId);
    } catch {
      return null;
    }
  }

  /**
   * Tries to send a DM to a user
   * @param userId The id of the user
   * @param content The message content
   */
  public async tryDm(userId: string, content: MessageOptions): Promise<Message | null> {
    try {
      const user = await this.fetchUser(userId);
      if (!user) return null;

      return user.send(content);
    } catch {
      return null;
    }
  }
}
