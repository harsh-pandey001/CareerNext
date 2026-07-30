import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { JobType, WorkMode } from '@careernext/shared-types';

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
}
