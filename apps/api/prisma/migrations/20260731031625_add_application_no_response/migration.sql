-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'APPLICATION_NO_RESPONSE';

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "noResponseNotifiedAt" TIMESTAMP(3);
