import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { LanguageProficiency } from '@careernext/shared-types';

@InputType()
export class LanguageInput {
  @Field()
  @IsString()
  @MaxLength(60)
  name!: string;

  @Field(() => LanguageProficiency)
  @IsEnum(LanguageProficiency)
  proficiency!: LanguageProficiency;
}
