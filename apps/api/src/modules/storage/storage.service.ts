import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Object storage for user documents, backed by Cloudflare R2.
 *
 * R2 speaks the S3 API, so this is the stock AWS SDK pointed at an R2
 * endpoint — swapping to real S3 later means changing the endpoint and
 * credentials, nothing else. R2 is used because its egress is free, and
 * every resume view is a download.
 *
 * Bytes used to live in Postgres (`Document.fileData`). They moved here
 * because the managed Postgres free tier is 0.5 GB, which a few hundred
 * resumes would exhaust — and because serving a 5 MB file as a base64
 * `data:` URI through GraphQL inflates it by a third on every read.
 *
 * The bucket is private. Nothing is ever served directly from it; callers
 * get short-lived presigned URLs.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket?: string;
  private readonly signedUrlTtlSec: number;
  private readonly client?: S3Client;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('storage.accountId');
    const accessKeyId = this.config.get<string>('storage.accessKeyId');
    const secretAccessKey = this.config.get<string>('storage.secretAccessKey');
    this.bucket = this.config.get<string>('storage.bucket');
    this.signedUrlTtlSec = this.config.get<number>('storage.signedUrlTtlSec') ?? 300;

    if (accountId && accessKeyId && secretAccessKey && this.bucket) {
      this.client = new S3Client({
        // R2 is not region-partitioned; the SDK still requires the field.
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
      });
    } else {
      this.logger.warn('R2 is not configured — document upload and download will fail until R2_* env vars are set.');
    }
  }

  /** True when every R2 env var is present, i.e. document routes can work. */
  get isConfigured(): boolean {
    return this.client !== undefined;
  }

  /**
   * Storage key for a new upload. The random UUID — not the user-supplied
   * name — is what makes the key unique and unguessable; the original
   * filename is kept in Postgres and re-attached at download time via
   * Content-Disposition.
   */
  buildKey(userId: string, fileName: string): string {
    return `documents/${userId}/${randomUUID()}${extname(fileName).toLowerCase()}`;
  }

  async putObject(key: string, body: Buffer, mimeType: string): Promise<void> {
    const client = this.assertConfigured();
    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
      }),
    );
  }

  /**
   * Short-lived download URL. The TTL is deliberately small: these URLs
   * carry their own authorisation, so anyone holding one can read the file
   * until it expires. Callers must check ownership before minting one.
   */
  async getSignedDownloadUrl(key: string, fileName: string, mimeType: string): Promise<string> {
    const client = this.assertConfigured();
    return getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: mimeType,
        // Preserves the name the user uploaded, instead of the UUID key.
        ResponseContentDisposition: `inline; filename="${encodeURIComponent(fileName)}"`,
      }),
      { expiresIn: this.signedUrlTtlSec },
    );
  }

  /**
   * Best-effort delete. Callers use this to clean up after a failed
   * transaction or a deleted row, where throwing would replace a useful
   * error with a confusing one, or undo a delete the user already saw
   * succeed. A leaked object costs storage; a thrown error costs the
   * request.
   */
  async deleteObjectQuietly(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    } catch (error) {
      this.logger.error(`Failed to delete orphaned object ${key}: ${(error as Error).message}`);
    }
  }

  private assertConfigured(): S3Client {
    if (!this.client) {
      throw new InternalServerErrorException(
        'Document storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET.',
      );
    }
    return this.client;
  }
}
