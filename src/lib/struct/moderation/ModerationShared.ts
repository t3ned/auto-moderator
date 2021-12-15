import { Prisma, Guild, Modlog, ModlogCaseType, ModerationTask } from "@prisma/client";
import type { ModerationPendingAction } from "./scheduler/ModerationPendingAction";

export interface ModlogUser {
  id: string;
  tag: string;
}

export enum ModlogReason {
  REVERSE,
  EXPIRED,
  SPAM
}

export const ModlogReasons: Record<ModlogReason, string> = {
  [ModlogReason.REVERSE]: "Action was reversed via button.",
  [ModlogReason.EXPIRED]: "Action was reversed due to expiry.",
  [ModlogReason.SPAM]: "Spam is not allowed anywhere in this server."
};

export const reversedModlogActionMap: Record<ModlogCaseType, ModlogCaseType | null> = {
  [ModlogCaseType.WARN]: null,
  [ModlogCaseType.KICK]: null,
  [ModlogCaseType.MUTE]: ModlogCaseType.UNMUTE,
  [ModlogCaseType.UNMUTE]: null,
  [ModlogCaseType.BAN]: ModlogCaseType.UNBAN,
  [ModlogCaseType.UNBAN]: null
};

// eslint-disable-next-line prettier/prettier
export type ModlogData = Omit<Prisma.ModlogCreateInput, "moderatorId" | "offenderId" | "caseId" | "guild"> 
export type ModlogCreateInputWithoutGuild = Omit<Prisma.ModlogCreateInput, "guild">;

export type GuildWithModlogs = Guild & { modlogs: Modlog[] };
export type ModlogWithTask = Modlog & { task: ModerationTask | null };
export type ModlogWithPendingAction = Modlog & { task: ModerationPendingAction | null };