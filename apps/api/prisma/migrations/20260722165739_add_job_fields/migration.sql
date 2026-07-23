/*
  Warnings:

  - Added the required column `type` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workMode` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "type" "JobType" NOT NULL,
ADD COLUMN     "workMode" "WorkMode" NOT NULL;

-- CreateIndex
CREATE INDEX "jobs_type_idx" ON "jobs"("type");

-- CreateIndex
CREATE INDEX "jobs_workMode_idx" ON "jobs"("workMode");
