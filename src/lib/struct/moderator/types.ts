import type { Prisma, Guild, Modlog, ModerationTask } from "@prisma/client";

export interface ModlogUser {
  id: string;
  tag: string;
}

// eslint-disable-next-line prettier/prettier
export type ModlogData = Omit<Modlog, "moderatorId" | "offenderId" | "caseId" | "guild"> 
export type ModlogCreateInputWithoutGuild = Omit<Prisma.ModlogCreateInput, "guild">;

export type GuildWithModlogs = Guild & { modlogs: Modlog[] };
export type ModlogWithTask = Modlog & { task: ModerationTask | null };
