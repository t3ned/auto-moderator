import type { ModerationManager } from "#lib";

export class ModerationActions {
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

  // public warn() {}
  // public kick() {}
  // public mute() {}
  // public unmute() {}
  // public ban() {}
  // public unban() {}
}
