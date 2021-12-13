import { Listener } from "discord-akairo";
import { listener, logger } from "#lib";
import type { Client } from "discord.js";

@listener("ready", {
  emitter: "client",
  event: "ready"
})
export default class extends Listener {
  public exec(client: Client<true>) {
    logger.info(`Logged in as ${client.user.tag}`);
  }
}
