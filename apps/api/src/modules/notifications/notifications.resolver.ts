import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { NotificationsService } from './notifications.service';
import { NotificationModel, toNotificationModel } from './models/notification.model';

@Resolver(() => NotificationModel)
@UseGuards(GqlAuthGuard)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [NotificationModel])
  async myNotifications(
    @CurrentUser() user: PrismaUser,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<NotificationModel[]> {
    const notifications = await this.notificationsService.findAllForUser(user.id, limit);
    return notifications.map(toNotificationModel);
  }

  @Query(() => Int)
  unreadNotificationCount(@CurrentUser() user: PrismaUser): Promise<number> {
    return this.notificationsService.countUnread(user.id);
  }

  @Mutation(() => NotificationModel)
  async markNotificationRead(
    @CurrentUser() user: PrismaUser,
    @Args('notificationId', { type: () => ID }) notificationId: string,
  ): Promise<NotificationModel> {
    const notification = await this.notificationsService.markRead(user.id, notificationId);
    return toNotificationModel(notification);
  }

  @Mutation(() => Boolean)
  markAllNotificationsRead(@CurrentUser() user: PrismaUser): Promise<boolean> {
    return this.notificationsService.markAllRead(user.id);
  }
}
