import { Listener } from "discord-akairo";
import { listener } from "#lib";
import type { GuildMember } from "discord.js";

@listener("massJoinAutomod", {
  emitter: "client",
  event: "guildMemberAdd"
})
export default class extends Listener {
  public exec(member: GuildMember) {
    if (member.user.bot) return;
    return this.client.mod.automod.runMemberJoinCheckers(member);
  }
}
