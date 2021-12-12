import { DatabaseHelpers, databaseLogger, config } from "#lib";
import { PrismaClient } from "@prisma/client";

export class DatabaseProvider {
  /**
   * The PrismaClient instance
   */
  public client: PrismaClient;

  /**
   * The database helpers
   */
  public helpers = new DatabaseHelpers(this);

  public constructor() {
    const client = new PrismaClient({
      datasources: {
        db: {
          url: config.uri.postgresql
        }
      },
      errorFormat: "pretty",
      rejectOnNotFound: {
        findFirst: false,
        findUnique: false
      },
      log: [
        { level: "info", emit: "event" },
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" }
      ]
    });

    client.$use(async (params, next) => {
      const startTime = Date.now();
      const result = await next(params);
      const timeTook = Date.now() - startTime;

      databaseLogger.info(`Query ${params.model}.${params.action} took ${timeTook}ms`);

      return result;
    });

    client.$on("info", (data) => databaseLogger.info(data.message));
    client.$on("warn", (data) => databaseLogger.warn(data.message));
    client.$on("error", (data) => databaseLogger.error(data.message));

    this.client = client;
  }
}

export const databaseProvider = new DatabaseProvider();
