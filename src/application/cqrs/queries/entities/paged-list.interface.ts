export interface IPagedList<T> {
  /** Total records before filtered. */
  totalRecords: number;

  /** Total records after filtered. */
  totalRecordsFiltered: number;

  /** Paged items. */
  items: T[];
}
