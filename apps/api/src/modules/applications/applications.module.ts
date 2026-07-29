import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ApplicationsService } from './applications.service';
import { ApplicationsResolver } from './applications.resolver';

@Module({
  imports: [NotificationsModule],
  providers: [ApplicationsService, ApplicationsResolver],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
