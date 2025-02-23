// namespace SharedKernel.Application.Cqrs.Queries.DataTables;

// /// <summary>
// ///
// /// </summary>
// public class Search
// {
//     /// <summary>
//     ///
//     /// </summary>
//     /// <param name="isRegex"></param>
//     /// <param name="value"></param>
//     public Search(string value, bool isRegex = false)
//     {
//         IsRegex = isRegex;
//         Value = value;
//     }

//     /// <summary>
//     ///
//     /// </summary>
//     public bool IsRegex { get; }

//     /// <summary>
//     ///
//     /// </summary>
//     public string Value { get; }

// }

export class Search {
  public readonly value: string;
  public readonly isRegex: boolean;

  constructor(value: string, isRegex: boolean = false) {
    this.value = value;
    this.isRegex = isRegex;
  }
}
