import type { DatabaseProvider, GuildWithModlogs, ModlogWithTask } from "#lib";
import type { Guild, Prisma } from "@prisma/client";

export class DatabaseHelpers {
  /**
   * The provider instance
   */
  private _provider: DatabaseProvider;

  /**
   * @param provider The provider instance
   */
  public constructor(provider: DatabaseProvider) {
    this._provider = provider;
  }

  /**
   * Get the provider client
   */
  public get client() {
    return this._provider.client;
  }

  /**
   * Finds a guild by id
   * @param guildId The id of the guild
   * @param withModlogs Whether to include modlogs
   */
  public findGuild(guildId: string, withModlogs: true): Promise<GuildWithModlogs | null>;
  /**
   * Finds a guild by id
   * @param guildId The id of the guild
   * @param withModlogs Whether to include modlogs
   */
  public findGuild(guildId: string, withModlogs: false): Promise<Guild | null>;
  /**
   * Finds a guild by id
   * @param guildId The id of the guild
   * @param withModlogs Whether to include modlogs
   */
  public findGuild(
    guildId: string,
    withModlogs = false
  ): Promise<Guild | GuildWithModlogs | null> {
    return this.client.guild.findUnique({
      include: {
        modlogs: withModlogs
      },
      where: {
        id: guildId
      }
    });
  }

  /**
   * Ensures a guild exists
   * @param guildId The id of the guild
   */
  public async ensureGuild(guildId: string): Promise<Guild> {
    return this.client.guild.upsert({
      where: {
        id: guildId
      },
      create: {
        id: guildId
      },
      update: {}
    });
  }

  /**
   * Updates a guild
   * @param guildId The id of the guild
   * @param data The data to update
   */
  public updateGuild(guildId: string, data: Prisma.GuildUpdateInput): Promise<Guild> {
    return this.client.guild.update({
      where: {
        id: guildId
      },
      data
    });
  }

  /**
   * Deletes a guild
   * @param guildId The id of the guild
   */
  public deleteGuild(guildId: string): Promise<Guild> {
    return this.client.guild.delete({
      where: {
        id: guildId
      }
    });
  }

  /**
   * Increments the guild modlog case id
   * @param guildId The id of the guild
   */
  public async incrementGuildModlogCaseId(guildId: string): Promise<Guild> {
    const guild = await this.ensureGuild(guildId);
    const modlogCaseId = guild.modlogCaseId + 1;
    return this.updateGuild(guildId, { modlogCaseId });
  }

  /**
   * Finds a modlog by message id
   * @param messageId The id of the message
   */
  public findModlogByMessageId(messageId: string): Promise<ModlogWithTask | null> {
    return this.client.modlog.findFirst({
      include: {
        task: true
      },
      where: {
        messageId
      }
    });
  }
}
