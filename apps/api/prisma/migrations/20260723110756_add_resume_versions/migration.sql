/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `documents` table. All the data in the column will be lost.
  - Added the required column `fileData` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "fileUrl",
ADD COLUMN     "fileData" BYTEA NOT NULL;

-- CreateTable
CREATE TABLE "resume_versions" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resume_versions_documentId_key" ON "resume_versions"("documentId");

-- CreateIndex
CREATE INDEX "resume_versions_userId_idx" ON "resume_versions"("userId");

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
