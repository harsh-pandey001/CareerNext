import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { DocumentType } from '@careernext/shared-types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { DocumentsService } from './documents.service';
import { CreateResumeDraftInput, UpdateResumeDraftInput } from './dto/resume-draft.input';
import { DocumentModel, toDocumentModel } from './models/document.model';
import { ResumeDraftModel, toResumeDraftModel } from './models/resume-draft.model';
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

  @Query(() => [ResumeDraftModel])
  async myResumeDrafts(@CurrentUser() user: PrismaUser): Promise<ResumeDraftModel[]> {
    const drafts = await this.documentsService.listResumeDrafts(user.id);
    return drafts.map(toResumeDraftModel);
  }

  @Query(() => ResumeDraftModel)
  async resumeDraft(
    @CurrentUser() user: PrismaUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ResumeDraftModel> {
    const draft = await this.documentsService.findResumeDraft(user.id, id);
    return toResumeDraftModel(draft);
  }

  @Mutation(() => ResumeDraftModel)
  async createResumeDraft(
    @CurrentUser() user: PrismaUser,
    @Args('input') input: CreateResumeDraftInput,
  ): Promise<ResumeDraftModel> {
    const draft = await this.documentsService.createResumeDraft(user.id, input);
    return toResumeDraftModel(draft);
  }

  @Mutation(() => ResumeDraftModel)
  async updateResumeDraft(
    @CurrentUser() user: PrismaUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateResumeDraftInput,
  ): Promise<ResumeDraftModel> {
    const draft = await this.documentsService.updateResumeDraft(user.id, id, input);
    return toResumeDraftModel(draft);
  }

  @Mutation(() => Boolean)
  deleteResumeDraft(
    @CurrentUser() user: PrismaUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.documentsService.deleteResumeDraft(user.id, id);
  }

  @Query(() => [DocumentModel])
  async myDocuments(
    @CurrentUser() user: PrismaUser,
    @Args('type', { type: () => DocumentType, nullable: true }) type?: DocumentType,
  ): Promise<DocumentModel[]> {
    const documents = await this.documentsService.listDocuments(user.id, type);
    return documents.map(toDocumentModel);
  }

  @Query(() => DocumentModel)
  async document(@CurrentUser() user: PrismaUser, @Args('id', { type: () => ID }) id: string): Promise<DocumentModel> {
    const document = await this.documentsService.findDocument(user.id, id);
    return toDocumentModel(document);
  }

  @Mutation(() => DocumentModel)
  async uploadDocument(
    @CurrentUser() user: PrismaUser,
    @Args('type', { type: () => DocumentType }) type: DocumentType,
    @Args('fileName') fileName: string,
    @Args('mimeType') mimeType: string,
    @Args('content') content: string,
  ): Promise<DocumentModel> {
    const document = await this.documentsService.uploadDocument(user.id, type, fileName, mimeType, content);
    return toDocumentModel(document);
  }

  @Mutation(() => Boolean)
  deleteDocument(@CurrentUser() user: PrismaUser, @Args('documentId', { type: () => ID }) documentId: string): Promise<boolean> {
    return this.documentsService.deleteDocument(user.id, documentId);
  }

  @ResolveField(() => String)
  async fileUrl(@CurrentUser() user: PrismaUser, @Parent() document: DocumentModel): Promise<string> {
    const file = await this.documentsService.getFileData(user.id, document.id);
    if (!file) return '';
    return `data:${file.mimeType};base64,${file.data.toString('base64')}`;
  }
}
