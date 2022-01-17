import { ClientOptions, Intents, Options } from "discord.js";

export enum Colors {
  Primary = 0x578af7,
  Success = 0x77dd77,
  Warning = 0xf5b426,
  Danger = 0xf45b69
}

export const clientOptions: ClientOptions = {
  restTimeOffset: 0,
  partials: ["MESSAGE"],
  makeCache: Options.cacheWithLimits({
    MessageManager: 100,
    ThreadManager: 100,
    UserManager: 10000
  }),
  intents: new Intents()
    .add("GUILDS")
    .add("GUILD_MEMBERS")
    .add("GUILD_BANS")
    .add("GUILD_MESSAGES")
};

export const moderationSchedulerPrecision = 1000 * 5;

export const domainRegex =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g;

// export const minimumAccountAge = 1000 * 60 * 60 * 48; // 48 hours

export const memberMassJoinThreshold = {
  limit: 20,
  time: 1000 * 60 * 15 // 10 minutes
};
