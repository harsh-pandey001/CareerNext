import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApplicationMode, JobType, WorkMode } from '@careernext/shared-types';

@InputType()
export class CustomJobInput {
  @Field()
  @IsString()
  @MaxLength(200)
  company!: string;

  @Field()
  @IsString()
  @MaxLength(200)
  title!: string;

  @Field(() => WorkMode)
  @IsEnum(WorkMode)
  workMode!: WorkMode;

  @Field(() => JobType, { nullable: true })
  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  experienceRequired?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  postedAt?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  externalUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  coverLetter?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  pitchEmail?: string;

  @Field(() => ApplicationMode, { nullable: true })
  @IsOptional()
  @IsEnum(ApplicationMode)
  applicationMode?: ApplicationMode;

  /** Omitted/true = the historical "adding IS applying" behavior; false = log it as SAVED. */
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  alreadyApplied?: boolean;

  /** Which of the user's own resume versions was sent for this application, if any. */
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  resumeVersionId?: string;
}
