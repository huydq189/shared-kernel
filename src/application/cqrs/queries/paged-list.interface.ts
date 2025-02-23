// namespace SharedKernel.Application.Cqrs.Queries.Contracts;

// /// <summary> A paged result. </summary>
// /// <typeparam name="T"></typeparam>
// public interface IPagedList<out T>
// {
//     /// <summary> Total records before filtered. </summary>
//     int TotalRecords { get; }

//     /// <summary> Total records after filtered. </summary>
//     int TotalRecordsFiltered { get; }

//     /// <summary> Paged items. </summary>
//     IEnumerable<T> Items { get; }
// }

export interface IPagedList<T> {
  /** Total records before filtered. */
  totalRecords: number;

  /** Total records after filtered. */
  totalRecordsFiltered: number;

  /** Paged items. */
  items: T[];
}
