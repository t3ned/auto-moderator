import type { Client } from "#lib";

export class ModeratorActions {
  /**
   * The client instance
   */
  public client!: Client;

  /**
   * @param client The client instance
   */
  public constructor(client: Client) {
    Reflect.defineProperty(this, "client", { value: client });
  }

  // public warn() {}
  // public kick() {}
  // public mute() {}
  // public unmute() {}
  // public ban() {}
  // public unban() {}
}
