import {
  ModlogWithTask,
  ModlogWithPendingAction,
  listener,
  databaseProvider,
  ModlogReason
} from "#lib";
import { ModlogCaseType } from "@prisma/client";
import type { Interaction, Guild, User } from "discord.js";
import { Listener } from "discord-akairo";

@listener("reverseAction", {
  emitter: "client",
  event: "interactionCreate"
})
export default class extends Listener {
  public async exec(interaction: Interaction) {
    if (!interaction.isButton()) return;

    const { message, guild, user, customId } = interaction;
    if (customId !== "reverse-action" || !guild || interaction.deferred) return;

    await interaction.deferReply({ ephemeral: true });

    // TODO: check mod permissions

    const modlog = await databaseProvider.helpers.findModlogByMessageId(message.id);
    if (!modlog) return interaction.editReply("Modlog not found.");

    switch (modlog.caseType) {
      case ModlogCaseType.BAN:
        const unban = await this._reverseBan(modlog, guild, user).catch(() => null);
        if (!unban) return interaction.editReply("User is not banned.");
        return interaction.editReply("Successfully unbanned");
    }
  }

  private _reverseBan(
    modlog: ModlogWithTask,
    guild: Guild,
    moderator: User
  ): Promise<ModlogWithPendingAction> {
    return this.client.mod.actions.unban(
      guild,
      modlog.offenderId,
      moderator,
      ModlogReason.REVERSE
    );
  }
}
