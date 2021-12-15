import {
  ModerationActions,
  ModerationScheduler,
  ModerationHistory,
  ModerationUtils,
  Client
} from "#lib";

export class ModerationManager {
  /**
   * The client instance
   */
  public client!: Client;

  /**
   * The moderation actions
   */
  public actions = new ModerationActions(this);

  /**
   * The moderation scheduler
   */
  public scheduler = new ModerationScheduler(this);

  /**
   * The moderation history
   */
  public history = new ModerationHistory(this);

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

  /**
   * Initialises all the helpers
   */
  public async init(): Promise<void> {
    await this.scheduler.init();
  }
}
