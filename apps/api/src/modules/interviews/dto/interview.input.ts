import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { InterviewRound } from '@careernext/shared-types';

@InputType()
export class InterviewInput {
  @Field(() => InterviewRound)
  @IsEnum(InterviewRound)
  round!: InterviewRound;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  scheduledAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
