import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import type { Language as PrismaLanguage } from '@prisma/client';
import { LanguageProficiency } from '@careernext/shared-types';

registerEnumType(LanguageProficiency, { name: 'LanguageProficiency' });

@ObjectType('Language')
export class LanguageModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => LanguageProficiency)
  proficiency!: LanguageProficiency;
}

export function toLanguageModel(language: PrismaLanguage): LanguageModel {
  const model = new LanguageModel();
  model.id = language.id;
  model.name = language.name;
  model.proficiency = language.proficiency as unknown as LanguageProficiency;
  return model;
}
