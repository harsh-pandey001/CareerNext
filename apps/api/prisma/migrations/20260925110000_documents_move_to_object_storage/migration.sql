-- Move document bytes out of Postgres and into object storage (Cloudflare R2).
--
-- `fileData` (BYTEA, added in 20260723110756_add_resume_versions) is replaced
-- by `fileKey`, the R2 object key. Two reasons: the managed Postgres free
-- tier is 0.5 GB, which a few hundred 5 MB resumes would exhaust; and every
-- read re-encoded the blob as a base64 data: URI, inflating it by a third.
--
-- NOTE: bytes are NOT migrated — they cannot be copied into R2 from SQL. The
-- ADD COLUMN ... NOT NULL below therefore fails loudly on any environment
-- that still holds document rows, which is deliberate: silently dropping
-- users' uploaded files would be worse than a failed deploy. Every
-- environment was empty (0 rows in `documents`) when this was written.

-- DropColumn
ALTER TABLE "documents" DROP COLUMN "fileData";

-- AddColumn
ALTER TABLE "documents" ADD COLUMN "fileKey" TEXT NOT NULL;
