import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import type { ResumeVersionWithDocument } from '../documents.service';
import { DocumentModel, toDocumentModel } from './document.model';

@ObjectType('ResumeVersion')
export class ResumeVersionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  version!: number;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field(() => DocumentModel)
  document!: DocumentModel;
}

export function toResumeVersionModel(resumeVersion: ResumeVersionWithDocument): ResumeVersionModel {
  const model = new ResumeVersionModel();
  model.id = resumeVersion.id;
  model.version = resumeVersion.version;
  model.isActive = resumeVersion.isActive;
  model.createdAt = resumeVersion.createdAt;
  model.document = toDocumentModel(resumeVersion.document);
  return model;
}
