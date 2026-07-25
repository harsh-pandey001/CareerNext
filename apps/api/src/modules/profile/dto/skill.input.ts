import { Field, Int, InputType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { SkillLevel } from '@careernext/shared-types';

@InputType()
export class SkillInput {
  @Field()
  @IsString()
  @MaxLength(60)
  name!: string;

  @Field(() => SkillLevel)
  @IsEnum(SkillLevel)
  level!: SkillLevel;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  yearsOfExperience?: number;
}
