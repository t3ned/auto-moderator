import {
  Embed,
  ModlogUser,
  ModlogData,
  ModlogWithTask,
  ModlogWithPendingAction,
  ModerationBase,
  fetchUser,
  formatUser,
  formatEmbedFieldDescription,
  undoModlogActionMap,
  databaseProvider,
  dangerEmbed,
  Client
} from "#lib";

import { Guild, TextChannel, MessageActionRow, MessageButton } from "discord.js";
import { parseMS } from "human-ms";

export class ModerationLog extends ModerationBase {
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
  ) {
    super((guild.client as Client).mod);
  }

  /**
   * Creates a new modlog from a modlog database entry
   * @param guild The guild
   * @param data The modlog data
   */
  public static async from(
    guild: Guild,
    data: ModlogWithTask
  ): Promise<ModerationLog | null> {
    const moderator = await fetchUser(guild.client, data.moderatorId);
    const offender = await fetchUser(guild.client, data.offenderId);

    if (!moderator || !offender) return null;

    return new ModerationLog(guild, moderator, offender, data, data.task?.duration);
  }

  /**
   * Gets the MessageEmbed representation of the modlog
   * @param caseId The case id of the modlog
   */
  public toEmbed(caseId: number): Embed {
    const content = formatEmbedFieldDescription([
      ["Moderator", formatUser(this.moderator)],
      ["Offender", formatUser(this.offender)],
      ["Reason", this.manager.utils.getReasonString(this.data.reason)],
      ["Duration", this.duration ? parseMS(this.duration) : ""]
    ]);

    const title = `[Automod: ${caseId}] ${this.data.caseType.toLowerCase().capitalize()}`;

    return dangerEmbed(content).setAuthor(title);
  }

  /**
   * Generates the modlog case id, sends the modlog message and creates the database entry
   */
  public async new(): Promise<ModlogWithPendingAction> {
    const guild = await databaseProvider.helpers.incrementGuildModlogCaseId(
      this.guild.id
    );

    const caseId = guild.modlogCaseId;
    let messageId: string | null = null;

    if (guild.modlogChannelId) {
      const channel = this.guild.channels.cache.get(guild.modlogChannelId) as TextChannel;
      if (channel) {
        const message = await channel
          .send({
            embeds: [this.toEmbed(caseId)],
            components: this.messageComponents ? [this.messageComponents] : []
          })
          .catch(() => null);

        if (message) messageId = message.id;
      }
    }

    const modlog = await databaseProvider.client.modlog.create({
      data: {
        ...this.data,
        moderatorId: this.moderator.id,
        offenderId: this.offender.id,
        messageId,
        caseId,
        guild: {
          connect: {
            id: this.guild.id
          }
        }
      }
    });

    const task = this.duration
      ? await this.manager.scheduler.create(modlog.id, this.duration)
      : null;

    return { ...modlog, task };
  }

  /**
   * Gets the message components to use in the modlog message
   */
  public get messageComponents(): MessageActionRow | null {
    const undoAction = undoModlogActionMap[this.data.caseType];
    if (!undoAction) return null;

    return new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("undo-action")
        .setStyle("SUCCESS")
        .setLabel(`↻ ${undoAction.toLowerCase().capitalize()}`)
    );
  }
}
