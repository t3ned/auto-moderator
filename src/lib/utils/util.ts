import type { Listener, ListenerOptions, Command, CommandOptions } from "discord-akairo";
import type { Monitor, MonitorOptions, ModlogUser } from "#lib";
import { Client, Constructable, Util } from "discord.js";

// eslint-disable-next-line @typescript-eslint/ban-types
export function createClassDecorator(fn: Function) {
  return fn;
}

/**
 * Applies the listener id and options to a listener
 * @param id The listener id
 * @param options The listener options
 */
export function listener<T extends ListenerOptions>(id: string, options: T) {
  return createClassDecorator((target: Constructable<Listener>) => {
    return class extends target {
      public constructor() {
        super(id, options);
      }
    };
  });
}

/**
 * Applies the command id and options to a command
 * @param id The command id
 * @param options The command options
 */
export function command<T extends CommandOptions>(id: string, options: T) {
  return createClassDecorator((target: Constructable<Command>) => {
    return class extends target {
      public constructor() {
        super(id, options);
      }
    };
  });
}

/**
 * Applies the monitor id and options to a monitor
 * @param id The monitor id
 * @param options The monitor options
 */
export function monitor<T extends MonitorOptions>(id: string, options: T) {
  return createClassDecorator((target: Constructable<Monitor>) => {
    return class extends target {
      public constructor() {
        super(id, options);
      }
    };
  });
}

/**
 * Fetches a user, catching errors
 * @param client The client instance
 * @param userId The id of the user
 */
export const fetchUser = (client: Client, userId: string) => {
  return client.users.fetch(userId).catch(() => null);
};

/**
 * Formats a user: username#discrim (id)
 * @param user The modlog user
 */
export const formatUser = (user: ModlogUser) => {
  return `${Util.escapeMarkdown(user.tag)} (${user.id})`;
};

/**
 * Formats a 2D array into a string
 * @param fields The fields to format
 */
export const formatEmbedFieldDescription = (fields: string[][]): string => {
  return fields
    .filter((field) => field[0] && field[1])
    .map(([name, value]) => `**❯ ${name}:** ${value}`)
    .join("\n");
};

/**
 * Capitalizes the first letter of a string
 */
String.prototype.capitalize = function () {
  return this[0].toLocaleUpperCase() + this.slice(1).toLocaleLowerCase();
};

declare global {
  export interface String {
    capitalize(): string;
  }
}
