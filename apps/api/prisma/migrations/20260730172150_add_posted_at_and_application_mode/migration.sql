-- CreateEnum
CREATE TYPE "ApplicationMode" AS ENUM ('EMAIL', 'JOB_PORTAL', 'GOOGLE_FORM', 'COMPANY_SITE');

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "applicationMode" "ApplicationMode";

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "postedAt" TEXT;
