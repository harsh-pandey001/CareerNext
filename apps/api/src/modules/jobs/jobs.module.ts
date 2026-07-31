import { Module } from '@nestjs/common';
import { ApplicationsModule } from '../applications/applications.module';
import { DocumentsModule } from '../documents/documents.module';
import { JobsResolver } from './jobs.resolver';
import { JobsService } from './jobs.service';

@Module({
  imports: [ApplicationsModule, DocumentsModule],
  providers: [JobsResolver, JobsService],
})
export class JobsModule {}
