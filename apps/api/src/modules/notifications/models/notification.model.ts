import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import type { Notification as PrismaNotification } from '@prisma/client';
import { NotificationType } from '@careernext/shared-types';

registerEnumType(NotificationType, { name: 'NotificationType' });

@ObjectType('Notification')
export class NotificationModel {
  @Field(() => ID)
  id!: string;

  @Field(() => NotificationType)
  type!: NotificationType;

  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field({ nullable: true })
  link?: string;

  @Field({ nullable: true })
  readAt?: Date;

  @Field()
  createdAt!: Date;
}

export function toNotificationModel(notification: PrismaNotification): NotificationModel {
  const model = new NotificationModel();
  model.id = notification.id;
  model.type = notification.type as unknown as NotificationType;
  model.title = notification.title;
  model.message = notification.message;
  model.link = notification.link ?? undefined;
  model.readAt = notification.readAt ?? undefined;
  model.createdAt = notification.createdAt;
  return model;
}
