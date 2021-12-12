import { AkairoHandler, AkairoHandlerOptions } from "discord-akairo";
import { Client, Monitor, logger } from "#lib";

import type { Collection } from "discord.js";

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

    this.client.on("messageCreate", async (message) => {
      for (const [id, monitor] of this.modules) {
        void id;

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
    });
  }
}
