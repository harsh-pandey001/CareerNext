-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "experienceRequired" TEXT;

-- CreateIndex
CREATE INDEX "jobs_createdById_idx" ON "jobs"("createdById");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
