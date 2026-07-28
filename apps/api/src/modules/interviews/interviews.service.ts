import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  InterviewOutcome as PrismaInterviewOutcome,
  InterviewRound as PrismaInterviewRound,
  type Interview as PrismaInterview,
} from '@prisma/client';
import type { InterviewOutcome } from '@careernext/shared-types';
import { PrismaService } from '../../database/prisma.service';
import type { InterviewInput } from './dto/interview.input';
import type { InterviewWithApplication } from './models/interview.model';

const WITH_APPLICATION = { application: { include: { job: true } } };

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /** All of a user's interviews — soonest scheduled first, unscheduled last. */
  async findAllForUser(userId: string): Promise<InterviewWithApplication[]> {
    return this.prisma.interview.findMany({
      where: { userId },
      orderBy: [{ scheduledAt: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
      include: WITH_APPLICATION,
    });
  }

  /** Pending interviews scheduled from now on — the dashboard widget's feed. */
  async findUpcomingForUser(userId: string, limit: number): Promise<InterviewWithApplication[]> {
    return this.prisma.interview.findMany({
      where: {
        userId,
        outcome: PrismaInterviewOutcome.PENDING,
        scheduledAt: { gte: new Date() },
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
      include: WITH_APPLICATION,
    });
  }

  async schedule(userId: string, applicationId: string, input: InterviewInput): Promise<InterviewWithApplication> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      select: { userId: true },
    });
    if (!application) {
      throw new NotFoundException('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenException('You do not have access to this application.');
    }

    return this.prisma.interview.create({
      data: {
        applicationId,
        userId,
        round: input.round as unknown as PrismaInterviewRound,
        scheduledAt: input.scheduledAt ?? null,
        notes: input.notes ?? null,
      },
      include: WITH_APPLICATION,
    });
  }

  async update(userId: string, interviewId: string, input: InterviewInput): Promise<InterviewWithApplication> {
    await this.ensureOwnership(userId, interviewId);
    return this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        round: input.round as unknown as PrismaInterviewRound,
        scheduledAt: input.scheduledAt ?? null,
        notes: input.notes ?? null,
      },
      include: WITH_APPLICATION,
    });
  }

  async setOutcome(userId: string, interviewId: string, outcome: InterviewOutcome): Promise<InterviewWithApplication> {
    await this.ensureOwnership(userId, interviewId);
    return this.prisma.interview.update({
      where: { id: interviewId },
      data: { outcome: outcome as unknown as PrismaInterviewOutcome },
      include: WITH_APPLICATION,
    });
  }

  async remove(userId: string, interviewId: string): Promise<boolean> {
    await this.ensureOwnership(userId, interviewId);
    await this.prisma.interview.delete({ where: { id: interviewId } });
    return true;
  }

  private async ensureOwnership(userId: string, interviewId: string): Promise<PrismaInterview> {
    const interview = await this.prisma.interview.findUnique({ where: { id: interviewId } });
    if (!interview) {
      throw new NotFoundException('Interview not found.');
    }
    if (interview.userId !== userId) {
      throw new ForbiddenException('You do not have access to this interview.');
    }
    return interview;
  }
}
