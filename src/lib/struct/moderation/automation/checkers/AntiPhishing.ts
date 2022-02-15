import {
  AutoModChecker,
  AutoModCheckerType,
  AutoModCheckerPriority,
  ModlogReason,
  consts,
  config,
  logger
} from "#lib";

import { AutomodModule } from "@prisma/client";
import type { Guild, Message, User } from "discord.js";
import axios from "axios";

export class AntiPhishing extends AutoModChecker {
  /**
   * The name of the module
   */
  public name = AutomodModule.PHISHING;

  /**
   * The type of this checker
   */
  public type = AutoModCheckerType.Message;

  /**
   * The priority of this checker
   */
  public priority = AutoModCheckerPriority.Medium;

  /**
   * Checks the message for phishing links
   */
  public async run(message: Message): Promise<boolean> {
    const domains = this._findDomains(message.content);
    if (!domains.length) return false;

    const match = await this._checkDomains(domains);
    if (!match) return false;

    const reason =
      match.type === "PHISHING" ? ModlogReason.PHISHING : ModlogReason.IP_LOGGER;

    await this.mod.actions
      .ban(message.guild as Guild, message.author, this.client.user as User, reason, 1)
      .catch(() => null);

    return true;
  }

  /**
   * Finds the domains sent in a message
   * @param content The message content
   */
  private _findDomains(content: string): string[] {
    const match = content.match(consts.domainRegex);
    if (!match) return [];
    return [...new Set(match.values())];
  }

  /**
   * Checks domains against the phishing api
   * @param domains The domains to check
   */
  private async _checkDomains(domains: string[]): Promise<PhishingMatch | null> {
    try {
      const res = await axios.post(
        config.phishingApiUrl,
        {
          message: domains.join(" ")
        },
        {
          headers: {
            "User-Agent": config.userAgent
          }
        }
      );

      if (!res.data.match) return null;
      return res.data.matches[0];
    } catch (error: any) {
      const status = error?.response?.status;
      if (status !== 404) logger.error(error);
      return null;
    }
  }
}

export interface PhishingMatch {
  type: "PHISHING" | "IP_LOGGER";
  followed: boolean;
  domain: string;
  source: string;
  trust_rating: number;
}
