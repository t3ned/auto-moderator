import {
  Embed,
  fetchUser,
  formatUser,
  formatEmbedFieldDescription,
  databaseProvider,
  dangerEmbed,
  consts
} from "#lib";

import type { Modlog as PrismaModlog } from "@prisma/client";
import type { ModlogUser, ModlogData } from "./types";
import type { Guild, TextChannel } from "discord.js";
import { parseMS } from "human-ms";

export class Modlog {
  /**
   * @param guild The guild
   * @param moderator The modlog moderator
   * @param offender The modlog offender
   * @param data The modlog create data
   * @param duration The action duration
   */
  public constructor(
    public guild: Guild,
    public moderator: ModlogUser,
    public offender: ModlogUser,
    public data: ModlogData,
    public duration?: number
  ) {}

  public toEmbed(caseId: number): Embed {
    const content = formatEmbedFieldDescription([
      ["Moderator", formatUser(this.moderator)],
      ["Offender", formatUser(this.offender)],
      ["Reason", consts.modlogReasons[this.data.reason]],
      ["Duration", this.duration ? parseMS(this.duration) : ""]
    ]);

    const title = `[Automod: ${caseId}] ${this.data.caseType.toLowerCase().capitalize()}`;

    return dangerEmbed(content).setAuthor(title);
  }

  public async done() {
    const guild = await databaseProvider.helpers.incrementGuildModlogCaseId(
      this.guild.id
    );

    const caseId = guild.modlogCaseId;
    let messageId: string | null = null;

    if (guild.modlogChannelId) {
      const channel = this.guild.channels.cache.get(guild.modlogChannelId) as TextChannel;
      if (channel) {
        // TODO: message components for opposite action
        const message = await channel
          .send({ embeds: [this.toEmbed(caseId)] })
          .catch(() => null);

        if (message) messageId = message.id;
      }
    }

    const modlog = await databaseProvider.helpers.createModlog(this.guild.id, {
      ...this.data,
      moderatorId: this.moderator.id,
      offenderId: this.offender.id,
      messageId,
      caseId
    });

    return modlog;
  }

  public static async from(guild: Guild, data: PrismaModlog): Promise<Modlog | null> {
    const moderator = await fetchUser(guild.client, data.moderatorId);
    const offender = await fetchUser(guild.client, data.offenderId);

    if (!moderator || !offender) return null;

    return new Modlog(guild, moderator, offender, data);
  }
}
