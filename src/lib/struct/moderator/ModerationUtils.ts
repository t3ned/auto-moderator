import type { Client, User, Message, MessageOptions } from "discord.js";
import type { ModerationManager } from "#lib";

export class ModerationUtils {
  /**
   * The manager instance
   */
  public manager!: ModerationManager;

  /**
   * @param manager The manager instance
   */
  public constructor(manager: ModerationManager) {
    Reflect.defineProperty(this, "manager", { value: manager });
  }

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

  /**
   * The client instance
   */
  public get client(): Client {
    return this.manager.client;
  }
}
