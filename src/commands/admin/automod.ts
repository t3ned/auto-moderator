import { Command } from "discord-akairo";
import { command, databaseProvider, primaryEmbed, successEmbed } from "#lib";
import type { Message } from "discord.js";
import { AutomodModule } from "@prisma/client";

const allModules = Reflect.ownKeys(AutomodModule) as AutomodModule[];

const toggleModule = (modules: AutomodModule[], moduleName: AutomodModule) => {
  const idx = modules.indexOf(moduleName);
  if (idx === -1) modules.push(moduleName);
  else modules.splice(idx, 1);
  return { modules, enabled: modules.includes(moduleName) };
};

@command("automod", {
  aliases: ["automod"],
  userPermissions: "MANAGE_MESSAGES",
  args: [
    {
      id: "automodModule",
      match: "rest",
      type: ["phishing", "massjoin", "mass_join", "mass join"]
    }
  ]
})
export default class extends Command {
  public async exec(message: Message, { automodModule }: Args) {
    if (!message.guildId) return;

    const modules = await this._getEnabledAutomodModules(message.guildId);

    if (!automodModule) {
      const mappedModules = allModules.map((mod) => {
        const name = mod
          .split("_")
          .map((x) => x.capitalize())
          .join(" ");
        const emoji = modules.includes(mod) ? "✅" : "❌";
        return `${name}: ${emoji}`;
      });

      const embed = primaryEmbed("Use `?automod <module>` to toggle on/off a module")
        .setTitle("Automod")
        .addField("Modules", mappedModules.join("\n"));

      return message.channel.send({ embeds: [embed] });
    }

    await databaseProvider.helpers.ensureGuild(message.guildId);

    switch (automodModule) {
      case "massjoin":
      case "mass_join":
      case "mass join": {
        const toggled = toggleModule(modules, "MASS_JOIN");
        await this._updateModules(message.guildId, toggled.modules);
        const embed = successEmbed(
          `Successfully ${
            toggled.enabled ? "enabled" : "disabled"
          } the **mass join** module.`
        );
        return message.channel.send({ embeds: [embed] });
      }
      case "phishing": {
        const toggled = toggleModule(modules, "PHISHING");
        await this._updateModules(message.guildId, toggled.modules);
        const embed = successEmbed(
          `Successfully ${
            toggled.enabled ? "enabled" : "disabled"
          } the **phishing** module.`
        );
        return message.channel.send({ embeds: [embed] });
      }
    }
  }

  private _getEnabledAutomodModules(guildId: string) {
    return databaseProvider.helpers.getEnabledAutomodModules(guildId);
  }

  private _updateModules(guildId: string, modules: AutomodModule[]) {
    return databaseProvider.client.guild.update({
      where: {
        id: guildId
      },
      data: {
        automodEnabledModules: modules
      }
    });
  }
}

type Args = {
  automodModule: string | null;
};
