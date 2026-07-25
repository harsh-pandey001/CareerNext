-- CreateIndex
CREATE INDEX "documents_userId_idx" ON "documents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "resume_versions_userId_version_key" ON "resume_versions"("userId", "version");
