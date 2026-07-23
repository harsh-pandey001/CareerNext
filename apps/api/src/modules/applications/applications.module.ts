import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsResolver } from './applications.resolver';

@Module({
  providers: [ApplicationsService, ApplicationsResolver],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
