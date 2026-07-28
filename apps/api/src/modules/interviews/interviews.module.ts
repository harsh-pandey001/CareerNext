import { Module } from '@nestjs/common';
import { ApplicationsModule } from '../applications/applications.module';
import { InterviewsService } from './interviews.service';
import { InterviewsResolver } from './interviews.resolver';

@Module({
  imports: [ApplicationsModule],
  providers: [InterviewsService, InterviewsResolver],
})
export class InterviewsModule {}
