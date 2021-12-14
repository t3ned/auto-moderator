import type { Client } from "discord.js";
import { ModerationUtils } from "#lib";

export class ModerationManager {
  /**
   * The client instance
   */
  public client!: Client;

  /**
   * The moderation utils
   */
  public utils = new ModerationUtils(this);

  /**
   * @param client The client instance
   */
  public constructor(client: Client) {
    Reflect.defineProperty(this, "client", { value: client });
  }
}
