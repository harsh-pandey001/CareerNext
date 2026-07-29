import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationType as PrismaNotificationType, type Notification as PrismaNotification } from '@prisma/client';
import type { NotificationType } from '@careernext/shared-types';
import { humanizeEnum } from '@careernext/utils';
import { PrismaService } from '../../database/prisma.service';

const DEFAULT_LIST_LIMIT = 20;

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string, limit = DEFAULT_LIST_LIMIT): Promise<PrismaNotification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 50),
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }

  async markRead(userId: string, notificationId: string): Promise<PrismaNotification> {
    const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have access to this notification.');
    }
    if (notification.readAt) return notification;

    return this.prisma.notification.update({ where: { id: notificationId }, data: { readAt: new Date() } });
  }

  async markAllRead(userId: string): Promise<boolean> {
    await this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
    return true;
  }

  /**
   * Internal — called by other services (Applications, Interviews) to emit
   * a notification. Deliberately swallows its own failures: a notification
   * that couldn't be written must never fail the status change / interview
   * action that triggered it.
   */
  async create(userId: string, type: NotificationType, title: string, message: string, link?: string): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: { userId, type: type as unknown as PrismaNotificationType, title, message, link },
      });
    } catch (error) {
      this.logger.error(`Failed to create notification for user ${userId}: ${String(error)}`);
    }
  }

  /**
   * Every 10 minutes: interviews scheduled within the next 24h that haven't
   * been reminded about yet. `reminderSentAt` is the dedup key — set inside
   * the same transaction as the notification write, so a crash between the
   * two can only result in a missed reminder, never a duplicate one.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async sendUpcomingInterviewReminders(): Promise<void> {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const dueInterviews = await this.prisma.interview.findMany({
      where: {
        outcome: 'PENDING',
        reminderSentAt: null,
        scheduledAt: { gte: now, lte: windowEnd },
      },
      include: { application: { include: { job: true } } },
    });

    for (const interview of dueInterviews) {
      const { job } = interview.application;
      await this.prisma.$transaction([
        this.prisma.notification.create({
          data: {
            userId: interview.userId,
            type: PrismaNotificationType.INTERVIEW_REMINDER,
            title: 'Upcoming interview',
            message: `${humanizeEnum(interview.round)} for ${job.title} at ${job.company} is coming up.`,
            link: '/interviews',
          },
        }),
        this.prisma.interview.update({ where: { id: interview.id }, data: { reminderSentAt: now } }),
      ]);
    }

    if (dueInterviews.length > 0) {
      this.logger.log(`Sent ${dueInterviews.length} upcoming-interview reminder(s).`);
    }
  }
}
