import { Monitor, monitor } from "#lib";
import type { Message } from "discord.js";

@monitor("automod", {})
export default class extends Monitor {
  public async exec(message: Message) {
    return this.client.mod.automod.runMessageCheckers(message);
  }
}
