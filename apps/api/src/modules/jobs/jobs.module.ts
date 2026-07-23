import { Module } from '@nestjs/common';
import { ApplicationsModule } from '../applications/applications.module';
import { JobsResolver } from './jobs.resolver';
import { JobsService } from './jobs.service';

@Module({
  imports: [ApplicationsModule],
  providers: [JobsResolver, JobsService],
})
export class JobsModule {}
