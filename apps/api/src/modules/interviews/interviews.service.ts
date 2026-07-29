import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  InterviewOutcome as PrismaInterviewOutcome,
  InterviewRound as PrismaInterviewRound,
  type Interview as PrismaInterview,
} from '@prisma/client';
import { ApplicationStatus } from '@careernext/shared-types';
import type { InterviewOutcome } from '@careernext/shared-types';
import { PrismaService } from '../../database/prisma.service';
import { ApplicationsService } from '../applications/applications.service';
import type { InterviewInput } from './dto/interview.input';
import type { InterviewWithApplication } from './models/interview.model';

const WITH_APPLICATION = { application: { include: { job: true } } };

/**
 * Scheduling a round is evidence the application actually reached that
 * stage — the status should reflect reality even if the user never
 * separately clicked "move to X" on the Applications board. Mirrors
 * ApplicationStatus's naming exactly for OA_SCHEDULED/HR_ROUND; the two
 * technical rounds map 1:1 to their pipeline counterparts.
 */
const ROUND_TO_STATUS: Record<PrismaInterviewRound, ApplicationStatus> = {
  ONLINE_ASSESSMENT: ApplicationStatus.OA_SCHEDULED,
  TECHNICAL_ROUND_1: ApplicationStatus.INTERVIEW_ROUND_1,
  TECHNICAL_ROUND_2: ApplicationStatus.INTERVIEW_ROUND_2,
  HR_ROUND: ApplicationStatus.HR_ROUND,
};

@Injectable()
export class InterviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  /** All of a user's interviews — soonest scheduled first, unscheduled last. */
  async findAllForUser(userId: string): Promise<InterviewWithApplication[]> {
    return this.prisma.interview.findMany({
      where: { userId },
      orderBy: [{ scheduledAt: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
      include: WITH_APPLICATION,
    });
  }

  /**
   * Pending interviews the user still needs to show up for — the dashboard
   * widget's feed. Includes both dated-and-future interviews AND ones with
   * no date yet (the UI renders those as "Not scheduled yet"); a plain
   * `scheduledAt: { gte: now }` filter would silently drop the unscheduled
   * ones, since SQL NULL never satisfies a `gte` comparison.
   */
  async findUpcomingForUser(userId: string, limit: number): Promise<InterviewWithApplication[]> {
    return this.prisma.interview.findMany({
      where: {
        userId,
        outcome: PrismaInterviewOutcome.PENDING,
        OR: [{ scheduledAt: null }, { scheduledAt: { gte: new Date() } }],
      },
      orderBy: [{ scheduledAt: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
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

    const round = input.round as unknown as PrismaInterviewRound;
    const interview = await this.prisma.interview.create({
      data: {
        applicationId,
        userId,
        round,
        scheduledAt: input.scheduledAt ?? null,
        notes: input.notes ?? null,
      },
    });

    // Best-effort, not transactional with the create above: the interview
    // existing is the important fact, and advanceStatusIfBehind is itself a
    // no-op if the application already reached (or passed) this stage, so
    // there's nothing to roll back if this half fails.
    await this.applicationsService.advanceStatusIfBehind(userId, applicationId, ROUND_TO_STATUS[round]);

    // Re-fetch with the application relation AFTER the possible status
    // advance above — otherwise the response's embedded application.status
    // would show the pre-advance value until the client separately refetches.
    return this.prisma.interview.findUniqueOrThrow({ where: { id: interview.id }, include: WITH_APPLICATION });
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
