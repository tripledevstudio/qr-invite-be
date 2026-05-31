/**
 * Generic pagination response shape.
 * `items` – the slice of data for the requested page.
 * `page` – current page number.
 * `page_size` – number of items requested per page.
 * `total_items` – total amount of items in the full collection.
 * `total_pages` – total pages available.
 * `has_reached_end` – true when the current page is the last one.
 */
export interface PaginationResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_reached_end: boolean;
}
