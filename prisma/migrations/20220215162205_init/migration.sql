-- CreateEnum
CREATE TYPE "ModlogCaseType" AS ENUM ('WARN', 'KICK', 'MUTE', 'UNMUTE', 'BAN', 'UNBAN');

-- CreateTable
CREATE TABLE "guilds" (
    "id" VARCHAR(20) NOT NULL,
    "modlog_case_id" INTEGER NOT NULL DEFAULT 0,
    "modlog_channel_id" VARCHAR(20),

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modlogs" (
    "id" CHAR(25) NOT NULL,
    "case_id" INTEGER NOT NULL,
    "case_type" "ModlogCaseType" NOT NULL,
    "reason" SMALLINT NOT NULL,
    "offender_id" VARCHAR(20) NOT NULL,
    "moderator_id" VARCHAR(20) NOT NULL,
    "message_id" VARCHAR(20),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "guildId" VARCHAR(20) NOT NULL,

    CONSTRAINT "modlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_tasks" (
    "modlog_id" CHAR(25) NOT NULL,
    "duration" INTEGER NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,

    CONSTRAINT "moderation_tasks_pkey" PRIMARY KEY ("modlog_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modlogs_guildId_case_id_key" ON "modlogs"("guildId", "case_id");

-- AddForeignKey
ALTER TABLE "modlogs" ADD CONSTRAINT "modlogs_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_tasks" ADD CONSTRAINT "moderation_tasks_modlog_id_fkey" FOREIGN KEY ("modlog_id") REFERENCES "modlogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
