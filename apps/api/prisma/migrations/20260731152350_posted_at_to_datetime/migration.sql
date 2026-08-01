/*
  Warnings:

  - The `postedAt` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "postedAt",
ADD COLUMN     "postedAt" TIMESTAMP(3);
