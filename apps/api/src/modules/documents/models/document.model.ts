import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { DocumentType } from '@careernext/shared-types';
import type { DocumentMeta } from '../documents.service';

registerEnumType(DocumentType, { name: 'DocumentType' });

@ObjectType('Document')
export class DocumentModel {
  @Field(() => ID)
  id!: string;

  @Field(() => DocumentType)
  type!: DocumentType;

  @Field()
  fileName!: string;

  @Field(() => Int)
  fileSize!: number;

  @Field()
  mimeType!: string;

  @Field()
  createdAt!: Date;

  // Deliberately not set by toDocumentModel below — resolved lazily via
  // @ResolveField in DocumentsResolver, so the (potentially large) file
  // bytes are only fetched from the DB when a query actually asks for this
  // field, not on every list query.
  @Field()
  fileUrl!: string;
}

export function toDocumentModel(document: DocumentMeta): DocumentModel {
  const model = new DocumentModel();
  model.id = document.id;
  model.type = document.type as unknown as DocumentType;
  model.fileName = document.fileName;
  model.fileSize = document.fileSize;
  model.mimeType = document.mimeType;
  model.createdAt = document.createdAt;
  return model;
}
