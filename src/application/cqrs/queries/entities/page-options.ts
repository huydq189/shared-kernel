import {FilterProperty} from './filter-property';
import {Order} from './order';

export class PageOptions {
  constructor(
    public skip?: number,
    public take?: number,
    public searchText?: string,
    public showDeleted?: boolean,
    public showOnlyDeleted?: boolean,
    public orders?: Order[],
    public filterProperties?: FilterProperty[],
  ) {}
}
