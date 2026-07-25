import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class EducationInput {
  @Field()
  @IsString()
  @MaxLength(160)
  institution!: string;

  @Field()
  @IsString()
  @MaxLength(160)
  degree!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  fieldOfStudy?: string;

  @Field(() => Date)
  @IsDate()
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  grade?: string;
}
