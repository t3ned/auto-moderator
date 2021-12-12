import { AkairoModule, AkairoModuleOptions } from "discord-akairo";
import type { Message, MessageType } from "discord.js";

export class Monitor extends AkairoModule {
  /**
   * The types of messages to ignore
   */
  public ignore: MessageType[];

  /**
   * @param id The monitor id
   * @param options The monitor options
   */
  public constructor(id: string, options: MonitorOptions) {
    super(id, options);

    this.ignore = options.ignore ?? [];
  }

  /**
   * Executed when a message is received
   * @param message The message to monitor
   */
  public async exec(message: Message): Promise<void> {
    void message;
  }
}

export interface MonitorOptions extends AkairoModuleOptions {
  ignore?: MessageType[];
}
