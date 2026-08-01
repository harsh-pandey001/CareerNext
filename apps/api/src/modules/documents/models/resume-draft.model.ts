import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { ResumeDraft as PrismaResumeDraft } from '@prisma/client';

@ObjectType('ResumeDraft')
export class ResumeDraftModel {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  template!: string;

  /** Serialized ResumeContent JSON (see @careernext/shared-types). */
  @Field()
  content!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export function toResumeDraftModel(draft: PrismaResumeDraft): ResumeDraftModel {
  const model = new ResumeDraftModel();
  model.id = draft.id;
  model.title = draft.title;
  model.template = draft.template;
  model.content = draft.content;
  model.createdAt = draft.createdAt;
  model.updatedAt = draft.updatedAt;
  return model;
}
