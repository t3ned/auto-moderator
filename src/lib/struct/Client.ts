import { AkairoClient, ListenerHandler, CommandHandler } from "discord-akairo";
import type { ClientOptions } from "discord.js";
import { config } from "#lib";
import { join } from "path";

export class Client extends AkairoClient {
  /**
   * The listener handler
   */
  public listenerHandler = new ListenerHandler(this, {
    directory: join(process.cwd(), "dist", "events")
  });

  /**
   * The command handler
   */
  public commandHandler = new CommandHandler(this, {
    directory: join(process.cwd(), "dist", "commands"),
    prefix: config.prefix,
    commandUtil: true,
    allowMention: true
  });

  /**
   * @param options The client options
   */
  public constructor(options: ClientOptions) {
    super(options);

    this.listenerHandler.setEmitters({
      listenerHandler: this.listenerHandler,
      commandHandler: this.commandHandler
    });

    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }
}
