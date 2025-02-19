import {IAggregateRoot} from '../../../domain';
import {Crud} from './crud';
import {IOperationAsync} from './operation-async.interface';

export class OperationAsync<T extends IAggregateRoot<TId>, TId>
  implements IOperationAsync
{
  public crud: Crud;
  public aggregateRoot: T;
  public commitMethodAsync: () => Promise<void>;
  public rollbackMethodAsync: () => Promise<void>;

  constructor(
    crud: Crud,
    aggregateRoot: T,
    commitMethodAsync: () => Promise<void>,
    rollbackMethodAsync: () => Promise<void>,
  ) {
    this.crud = crud;
    this.aggregateRoot = aggregateRoot;
    this.commitMethodAsync = commitMethodAsync;
    this.rollbackMethodAsync = rollbackMethodAsync;
  }
}
