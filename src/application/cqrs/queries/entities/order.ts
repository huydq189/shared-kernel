export class Order {
  public field?: string;
  public ascending?: boolean;

  constructor(field?: string, ascending?: boolean) {
    this.field = field;
    this.ascending = ascending;
  }
}
