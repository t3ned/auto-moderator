import type { RedisProvider } from "#lib";

export class RedisHelpers {
  /**
   * The provider instance
   */
  private _provider: RedisProvider;

  /**
   * @param provider The provider instance
   */
  public constructor(provider: RedisProvider) {
    this._provider = provider;
  }

  /**
   * Get the provider client
   */
  public get client() {
    return this._provider.client;
  }
}
