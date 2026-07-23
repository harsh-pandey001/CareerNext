import type { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL code-first equivalent of `@careernext/shared-types`' generic
 * `PaginatedResult<T>` — GraphQL has no generics, so this factory produces
 * one concrete `@ObjectType` per item type instead. Usage:
 *
 *   @ObjectType('PaginatedJobs')
 *   export class PaginatedJobsModel extends Paginated(JobModel) {}
 */
export function Paginated<T>(itemType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedModel {
    @Field(() => [itemType])
    items!: T[];

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    page!: number;

    @Field(() => Int)
    pageSize!: number;

    @Field(() => Int)
    totalPages!: number;
  }

  return PaginatedModel;
}
