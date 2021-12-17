import type { AutoModManager, ModerationManager, Client } from "#lib";

export abstract class AutoModChecker {
  /**
   * The automod instance
   */
  public automod!: AutoModManager;

  /**
   * The type of this checker
   */
  public abstract type: AutoModCheckerType;

  /**
   * The priority of this checker
   */
  public abstract priority: AutoModCheckerPriority;

  /**
   * @param automod The automod instance
   */
  public constructor(automod: AutoModManager) {
    Reflect.defineProperty(this, "automod", { value: automod });
  }

  /**
   * Runs the checker on the entities
   */
  public abstract run(...entities: unknown[]): Promise<boolean>;

  /**
   * The moderation manager instance
   */
  public get mod(): ModerationManager {
    return this.automod.manager;
  }

  /**
   * The client instance
   */
  public get client(): Client {
    return this.mod.client;
  }
}

export enum AutoModCheckerType {
  Message,
  GuildMemberAdd
}

export enum AutoModCheckerPriority {
  Low,
  Medium,
  High
}
