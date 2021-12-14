import { ClientOptions, Intents, Options } from "discord.js";

export enum Colors {
  Primary = 0x578af7,
  Success = 0x77dd77,
  Warning = 0xf5b426,
  Danger = 0xf45b69
}

export const clientOptions: ClientOptions = {
  restTimeOffset: 0,
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
