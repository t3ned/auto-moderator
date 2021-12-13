import type { Listener, ListenerOptions, Command, CommandOptions } from "discord-akairo";
import type { Monitor, MonitorOptions } from "#lib";
import type { Constructable } from "discord.js";

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
