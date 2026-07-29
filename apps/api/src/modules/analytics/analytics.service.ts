import { Injectable } from '@nestjs/common';
import { ApplicationStatus as PrismaApplicationStatus, type Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { PIPELINE_ORDER } from '../applications/applications.service';
import type { DateRangeInput } from './dto/date-range.input';
import type {
  ApplicationsAnalyticsModel,
  ApplicationsTrendPointModel,
  FunnelStageModel,
  InterviewRoundBreakdownModel,
  SuccessRatesModel,
} from './models/analytics.model';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getApplicationsAnalytics(userId: string, range?: DateRangeInput): Promise<ApplicationsAnalyticsModel> {
    const dateFilter = this.buildDateFilter(range);

    const applications = await this.prisma.application.findMany({
      where: { userId, ...(dateFilter && { createdAt: dateFilter }) },
      select: { id: true, status: true, appliedAt: true, createdAt: true },
    });

    // A rejected application's furthest-reached pipeline stage isn't its
    // current status (REJECTED is a side branch, not a pipeline position) —
    // it's whatever stage it was at just before rejection. For every other
    // application, the pipeline is strictly forward-only, so the CURRENT
    // status already *is* the furthest stage reached — no need to replay
    // history for those.
    const rejectedIds = applications
      .filter((application) => application.status === PrismaApplicationStatus.REJECTED)
      .map((application) => application.id);
    const highWaterMarkByRejectedId = await this.findPreRejectionStage(rejectedIds);

    const highWaterMarkIndexes = applications.map((application) => {
      if (application.status === PrismaApplicationStatus.REJECTED) {
        const priorStage = highWaterMarkByRejectedId.get(application.id);
        return priorStage ? PIPELINE_ORDER.indexOf(priorStage) : -1;
      }
      return PIPELINE_ORDER.indexOf(application.status);
    });

    const funnel = this.buildFunnel(highWaterMarkIndexes);
    const successRates = this.buildSuccessRates(applications, highWaterMarkIndexes);
    const trend = this.buildTrend(applications);
    const interviewsByRound = await this.buildInterviewBreakdown(userId, dateFilter);

    return { funnel, successRates, trend, interviewsByRound };
  }

  private buildDateFilter(range?: DateRangeInput): Prisma.DateTimeFilter | undefined {
    if (!range?.from && !range?.to) return undefined;
    const filter: Prisma.DateTimeFilter = {};
    if (range.from) filter.gte = range.from;
    if (range.to) filter.lte = range.to;
    return filter;
  }

  /** For each rejected application, its `toStatus` right before the REJECTED row. */
  private async findPreRejectionStage(
    rejectedApplicationIds: string[],
  ): Promise<Map<string, PrismaApplicationStatus>> {
    if (rejectedApplicationIds.length === 0) return new Map();

    const history = await this.prisma.applicationStatusHistory.findMany({
      where: { applicationId: { in: rejectedApplicationIds } },
      orderBy: { changedAt: 'asc' },
      select: { applicationId: true, toStatus: true },
    });

    const priorStage = new Map<string, PrismaApplicationStatus>();
    for (const row of history) {
      if (row.toStatus === PrismaApplicationStatus.REJECTED) continue;
      priorStage.set(row.applicationId, row.toStatus);
    }
    return priorStage;
  }

  /** Cumulative — how many applications reached at least each pipeline stage. */
  private buildFunnel(highWaterMarkIndexes: number[]): FunnelStageModel[] {
    return PIPELINE_ORDER.map((status, index) => ({
      status: status as unknown as FunnelStageModel['status'],
      count: highWaterMarkIndexes.filter((mark) => mark >= index).length,
    }));
  }

  private buildSuccessRates(
    applications: { status: PrismaApplicationStatus }[],
    highWaterMarkIndexes: number[],
  ): SuccessRatesModel {
    const offerIndex = PIPELINE_ORDER.indexOf(PrismaApplicationStatus.OFFER_RECEIVED);
    const totalApplications = applications.filter((a) => a.status !== PrismaApplicationStatus.SAVED).length;
    const totalOffers = highWaterMarkIndexes.filter((mark) => mark >= offerIndex).length;
    const totalAccepted = applications.filter((a) => a.status === PrismaApplicationStatus.ACCEPTED).length;
    const totalRejected = applications.filter((a) => a.status === PrismaApplicationStatus.REJECTED).length;

    return {
      totalApplications,
      totalOffers,
      totalAccepted,
      totalRejected,
      offerRate: totalApplications > 0 ? totalOffers / totalApplications : 0,
      acceptanceRate: totalOffers > 0 ? totalAccepted / totalOffers : 0,
    };
  }

  /** Applications submitted per calendar month — bookmarks (SAVED) don't count. */
  private buildTrend(
    applications: { status: PrismaApplicationStatus; appliedAt: Date | null; createdAt: Date }[],
  ): ApplicationsTrendPointModel[] {
    const counts = new Map<string, number>();
    for (const application of applications) {
      if (application.status === PrismaApplicationStatus.SAVED) continue;
      const submittedAt = application.appliedAt ?? application.createdAt;
      const period = `${submittedAt.getFullYear()}-${String(submittedAt.getMonth() + 1).padStart(2, '0')}`;
      counts.set(period, (counts.get(period) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({ period, count }));
  }

  private async buildInterviewBreakdown(
    userId: string,
    dateFilter?: Prisma.DateTimeFilter,
  ): Promise<InterviewRoundBreakdownModel[]> {
    const grouped = await this.prisma.interview.groupBy({
      by: ['round'],
      where: { userId, ...(dateFilter && { createdAt: dateFilter }) },
      _count: { _all: true },
    });

    return grouped.map((row) => ({
      round: row.round as unknown as InterviewRoundBreakdownModel['round'],
      count: row._count._all,
    }));
  }
}
