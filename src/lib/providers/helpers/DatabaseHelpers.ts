import type {
  DatabaseProvider,
  GuildWithModlogs,
  ModlogWithTask,
  ModlogCreateInputWithoutGuild
} from "#lib";

import type { Guild, ModerationTask, Prisma } from "@prisma/client";

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
   * Finds a guild by id
   * @param guildId The id of the guild
   * @param caseId The id of the modlog case
   */
  public findModlog(guildId: string, caseId: number): Promise<ModlogWithTask | null> {
    return this.client.modlog.findUnique({
      include: {
        task: true
      },
      where: {
        modlogId: {
          guildId,
          caseId
        }
      }
    });
  }

  /**
   * Finds all the modlogs for an offender
   * @param guildId The id of the guild
   * @param offenderId The id of the offender
   */
  public findModlogsByOffender(
    guildId: string,
    offenderId: string
  ): Promise<ModlogWithTask[]> {
    return this.client.modlog.findMany({
      include: {
        task: true
      },
      where: {
        guildId,
        offenderId
      }
    });
  }

  /**
   * Finds all the modlogs for a moderator
   * @param guildId The id of the guild
   * @param moderatorId The id of the moderator
   */
  public findModlogsByModerator(
    guildId: string,
    moderatorId: string
  ): Promise<ModlogWithTask[]> {
    return this.client.modlog.findMany({
      include: {
        task: true
      },
      where: {
        guildId,
        moderatorId
      }
    });
  }

  /**
   * Creates a modlog
   * @param guildId The id of the guild
   * @param data The modlog create data
   * @param duration The modlog create data
   */
  public async createModlog(
    guildId: string,
    data: ModlogCreateInputWithoutGuild,
    duration?: number
  ): Promise<ModlogWithTask> {
    const modlog = await this.client.modlog.create({
      include: {
        task: true
      },
      data: {
        ...data,
        guild: {
          connect: {
            id: guildId
          }
        }
      }
    });

    if (duration) {
      const task = await this.createModerationTask(modlog.id, duration);
      modlog.task = task;
    }

    return modlog;
  }

  /**
   * Creates a moderation task
   * @param modlogId The id of the modlog
   * @param duration The duration of the task
   */
  public createModerationTask(
    modlogId: string,
    duration: number
  ): Promise<ModerationTask> {
    return this.client.moderationTask.create({
      data: {
        duration,
        expiresAt: new Date(Date.now() + duration),
        modlog: {
          connect: {
            id: modlogId
          }
        }
      }
    });
  }

  /**
   * Deletes a moderation task
   * @param modlogId The id of the modlog
   */
  public deleteModerationTask(modlogId: string): Promise<ModerationTask> {
    return this.client.moderationTask.delete({
      where: {
        modlogId
      }
    });
  }
}
