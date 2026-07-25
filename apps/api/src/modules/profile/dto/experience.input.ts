import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class ExperienceInput {
  @Field()
  @IsString()
  @MaxLength(160)
  company!: string;

  @Field()
  @IsString()
  @MaxLength(160)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  location?: string;

  @Field(() => Date)
  @IsDate()
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field({ defaultValue: false })
  @IsBoolean()
  isCurrent!: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
