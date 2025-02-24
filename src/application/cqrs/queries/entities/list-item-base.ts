export class ListItemBase<T> {
  public id: T;
  public deleted: boolean;

  constructor(id: T, deleted: boolean = false) {
    this.id = id;
    this.deleted = deleted;
  }
}
