import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

/** Both bounds optional — an omitted range means "all time". */
@InputType()
export class DateRangeInput {
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  from?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  to?: Date;
}
