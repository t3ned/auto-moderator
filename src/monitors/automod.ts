import { Monitor, monitor } from "#lib";
import type { Message } from "discord.js";

@monitor("automod", {
  runOnEdit: true
})
export default class extends Monitor {
  public async exec(message: Message) {
    if (!message.guild || message.author.bot) return;
    return this.client.mod.automod.runMessageCheckers(message);
  }
}
