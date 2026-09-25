import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';

@Module({
  imports: [StorageModule],
  providers: [DocumentsService, DocumentsResolver],
  exports: [DocumentsService],
})
export class DocumentsModule {}
