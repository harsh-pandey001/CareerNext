import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobType, WorkMode } from '@careernext/shared-types';

@InputType()
export class JobFilterInput {
  /** Matches against title, company, and skills. */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  query?: string;

  @Field(() => JobType, { nullable: true })
  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @Field(() => WorkMode, { nullable: true })
  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;
}
