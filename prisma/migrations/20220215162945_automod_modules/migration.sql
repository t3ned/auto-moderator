-- CreateEnum
CREATE TYPE "AutomodModule" AS ENUM ('PHISHING', 'MASS_JOIN');

-- AlterTable
ALTER TABLE "guilds" ADD COLUMN     "automod_enabled_modules" "AutomodModule"[];
