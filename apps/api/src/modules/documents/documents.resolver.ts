import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { DocumentsService } from './documents.service';
import { DocumentModel } from './models/document.model';
import { ResumeVersionModel, toResumeVersionModel } from './models/resume-version.model';

@Resolver(() => DocumentModel)
@UseGuards(GqlAuthGuard)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Query(() => [ResumeVersionModel])
  async myResumeVersions(@CurrentUser() user: PrismaUser): Promise<ResumeVersionModel[]> {
    const versions = await this.documentsService.listResumeVersions(user.id);
    return versions.map(toResumeVersionModel);
  }

  @Query(() => ResumeVersionModel)
  async resumeVersion(
    @CurrentUser() user: PrismaUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ResumeVersionModel> {
    const version = await this.documentsService.findResumeVersion(user.id, id);
    return toResumeVersionModel(version);
  }

  @Mutation(() => ResumeVersionModel)
  async uploadResume(
    @CurrentUser() user: PrismaUser,
    @Args('fileName') fileName: string,
    @Args('mimeType') mimeType: string,
    @Args('content') content: string,
  ): Promise<ResumeVersionModel> {
    const version = await this.documentsService.uploadResume(user.id, fileName, mimeType, content);
    return toResumeVersionModel(version);
  }

  @Mutation(() => ResumeVersionModel)
  async setActiveResume(
    @CurrentUser() user: PrismaUser,
    @Args('resumeVersionId', { type: () => ID }) resumeVersionId: string,
  ): Promise<ResumeVersionModel> {
    const version = await this.documentsService.setActiveResume(user.id, resumeVersionId);
    return toResumeVersionModel(version);
  }

  @Mutation(() => Boolean)
  deleteResumeVersion(
    @CurrentUser() user: PrismaUser,
    @Args('resumeVersionId', { type: () => ID }) resumeVersionId: string,
  ): Promise<boolean> {
    return this.documentsService.deleteResumeVersion(user.id, resumeVersionId);
  }

  @ResolveField(() => String)
  async fileUrl(@Parent() document: DocumentModel): Promise<string> {
    const file = await this.documentsService.getFileData(document.id);
    if (!file) return '';
    return `data:${file.mimeType};base64,${file.data.toString('base64')}`;
  }
}
