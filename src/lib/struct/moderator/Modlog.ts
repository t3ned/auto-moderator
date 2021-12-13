import type { Prisma } from "@prisma/client";
import type { Guild, TextChannel, User } from "discord.js";
import { Embed, databaseProvider, dangerEmbed, consts } from "#lib";
import { parseMS } from "human-ms";

const formatUser = (user: User) => `${user.tag} (${user.id})`;

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
    public moderator: User,
    public offender: User,
    public data: ModlogData,
    public duration?: number
  ) {}

  public toEmbed(caseId: number): Embed {
    const content = [
      ["Moderator", formatUser(this.moderator)],
      ["Offender", formatUser(this.offender)],
      ["Reason", consts.modlogReasons[this.data.reason]],
      this.duration ? ["Duration", parseMS(this.duration)] : []
    ]
      .filter((x) => x !== null)
      .map(([key, value]) => `**❯ ${key}:** ${value}`)
      .join("\n");

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
      moderatorId: this.moderator.id,
      offenderId: this.offender.id,
      messageId,
      caseId,
      ...this.data
    });

    return modlog;
  }
}

// eslint-disable-next-line prettier/prettier
export type ModlogData = Omit<Prisma.ModlogCreateInput, "moderatorId" | "offenderId" | "caseId">;
