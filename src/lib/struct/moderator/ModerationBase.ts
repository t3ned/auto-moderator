import type { ModerationManager, Client } from "#lib";

export class ModerationBase {
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
   * The client instance
   */
  public get client(): Client {
    return this.manager.client;
  }
}
