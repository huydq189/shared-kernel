// namespace SharedKernel.Application.Cqrs.Queries.DataTables;

// /// <summary> . </summary>
// public class Column
// {
//     /// <summary> . </summary>
//     public Column(string data, string? name = default, Search? search = default, bool searchable = true,
//         bool orderable = true)
//     {
//         Data = data;
//         Name = name;
//         Search = search;
//         Searchable = searchable;
//         Orderable = orderable;
//     }

//     /// <summary> . </summary>
//     public string Data { get; }

//     /// <summary> . </summary>
//     public string? Name { get; }

//     /// <summary> . </summary>
//     public Search? Search { get; }

//     /// <summary> . </summary>
//     public bool Searchable { get; }

//     /// <summary> . </summary>
//     public bool Orderable { get; }
// }

export class Column {
  public readonly data: string;
  public readonly name?: string;
  public readonly search?: Search;
  public readonly searchable: boolean;
  public readonly orderable: boolean;

  public constructor(
    data: string,
    name?: string,
    search?: Search,
    searchable = true,
    orderable = true,
  ) {
    this.data = data;
    this.name = name;
    this.search = search;
    this.searchable = searchable;
    this.orderable = orderable;
  }
}
