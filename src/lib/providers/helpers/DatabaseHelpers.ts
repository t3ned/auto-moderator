import type { DatabaseProvider } from "#lib";

export class DatabaseHelpers {
  /**
   * The provider instance
   */
  private _provider: DatabaseProvider;

  /**
   * @param provider The provider instance
   */
  public constructor(provider: DatabaseProvider) {
    this._provider = provider;
  }

  /**
   * Get the provider client
   */
  public get client() {
    return this._provider.client;
  }
}
