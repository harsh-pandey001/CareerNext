import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';
import type { PaginationInput as PaginationInputShape } from '@careernext/shared-types';

@InputType('PaginationInput')
export class PaginationInput implements PaginationInputShape {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize!: number;
}
