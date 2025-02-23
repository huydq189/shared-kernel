// namespace SharedKernel.Application.Cqrs.Queries.DataTables;

// /// <summary>
// ///
// /// </summary>
// public class DataTablesOrder
// {
//     /// <summary>
//     ///
//     /// </summary>
//     /// <param name="column"></param>
//     /// <param name="dir"></param>
//     public DataTablesOrder(int column, string dir)
//     {
//         Column = column;
//         Dir = dir;
//     }

//     /// <summary>
//     ///
//     /// </summary>
//     public int Column { get; }

//     /// <summary>
//     ///
//     /// </summary>
//     public string Dir { get; }
// }

export class DataTablesOrder {
  public column: number;
  public dir: string;

  constructor(column: number, dir: string) {
    this.column = column;
    this.dir = dir;
  }
}
