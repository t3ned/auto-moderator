import { AkairoHandler, AkairoHandlerOptions } from "discord-akairo";
import type { Collection, Message } from "discord.js";
import { Client, Monitor, logger } from "#lib";

export class MonitorHandler extends AkairoHandler {
  /**
   * The monitors the handler holds
   */
  public modules!: Collection<string, Monitor>;

  /**
   * @param client The client instance
   * @param options The handler options
   */
  public constructor(client: Client, options: AkairoHandlerOptions = {}) {
    super(client, {
      classToHandle: Monitor,
      ...options
    });

    this.client.on("messageCreate", this._runMessage.bind(this));
    this.client.on("messageUpdate", async (_, message) =>
      this._runMessage(message as Message)
    );
  }

  /**
   * Runs all the monitors on the message
   * @param message The message to monitor
   */
  private async _runMessage(message: Message) {
    if (message.partial) await message.fetch();

    for (const monitor of this.modules.values()) {
      if (monitor.ignore.includes(message.type)) continue;

      try {
        await monitor.exec(message);
      } catch (error) {
        if (error instanceof Error || typeof error === "string") {
          logger.error(error);
        }

        // noop
      }
    }
  }
}
