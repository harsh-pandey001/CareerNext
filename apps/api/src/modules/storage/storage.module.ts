import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

/** Object storage (Cloudflare R2) for user-uploaded documents. */
@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
