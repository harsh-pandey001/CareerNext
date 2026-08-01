import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// Content is a serialized ResumeContent JSON document; the service verifies
// it parses. 256KB comfortably fits any real resume while keeping a single
// row from ballooning.
export const MAX_RESUME_CONTENT_LENGTH = 256 * 1024;

@InputType()
export class CreateResumeDraftInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  template?: string;

  @Field()
  @IsString()
  @MaxLength(MAX_RESUME_CONTENT_LENGTH)
  content!: string;
}

@InputType()
export class UpdateResumeDraftInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  template?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_RESUME_CONTENT_LENGTH)
  content?: string;
}
