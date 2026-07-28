import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsResolver } from './interviews.resolver';

@Module({
  providers: [InterviewsService, InterviewsResolver],
})
export class InterviewsModule {}
