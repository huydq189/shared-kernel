export class Results<T> {
  public readonly draw: number;
  public readonly recordsTotal: number;
  public readonly recordsFiltered: number;
  public readonly data: T[];

  constructor(
    draw: number,
    recordsTotal: number,
    recordsFiltered: number,
    data: T[],
  ) {
    this.draw = draw;
    this.recordsTotal = recordsTotal;
    this.recordsFiltered = recordsFiltered;
    this.data = data;
  }
}
