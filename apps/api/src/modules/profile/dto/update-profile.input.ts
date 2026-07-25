import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator';

// A blank string means "clear this field" (normalized to null in the
// service layer) — @IsOptional() alone only skips undefined/null, so the
// URL fields also need @ValidateIf to skip format validation on ''.
const isPresent = (_target: unknown, value: unknown) => value !== undefined && value !== '';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  headline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @Field({ nullable: true })
  @ValidateIf(isPresent)
  @IsUrl()
  githubUrl?: string;

  @Field({ nullable: true })
  @ValidateIf(isPresent)
  @IsUrl()
  linkedinUrl?: string;

  @Field({ nullable: true })
  @ValidateIf(isPresent)
  @IsUrl()
  portfolioUrl?: string;
}
