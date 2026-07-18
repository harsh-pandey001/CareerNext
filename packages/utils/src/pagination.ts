import type { PaginatedResult } from '@careernext/shared-types';

/** Wrap a page of items into the standard PaginatedResult envelope. */
export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
  };
}

/** Convert a page/pageSize pair into a Prisma-style skip/take. */
export function toSkipTake(page: number, pageSize: number): { skip: number; take: number } {
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);
  return { skip: (safePage - 1) * safeSize, take: safeSize };
}
