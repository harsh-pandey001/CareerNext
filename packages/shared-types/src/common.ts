/**
 * Common primitives and cross-cutting types.
 */

/** ISO-8601 timestamp string (e.g. "2026-07-19T10:00:00.000Z"). */
export type ISODateString = string;

/** Universally unique identifier. */
export type UUID = string;

/** Base fields present on every persisted entity. */
export interface BaseEntity {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Standard cursor/offset pagination request. */
export interface PaginationInput {
  page: number;
  pageSize: number;
}

/** Standard paginated response envelope. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
