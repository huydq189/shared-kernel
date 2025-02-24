import {IPagedList} from './paged-list.interface';

export class PagedList<T> implements IPagedList<T> {
  private static instance = new PagedList<any>(0, []);
  public readonly totalRecords: number;

  public static empty<T>(): PagedList<T> {
    return PagedList.instance;
  }

  constructor(
    public readonly totalRecordsFiltered: number,
    public readonly items: T[],
  ) {
    this.totalRecords = totalRecordsFiltered;
    this.totalRecordsFiltered = totalRecordsFiltered;
    this.items = items;
  }
}
