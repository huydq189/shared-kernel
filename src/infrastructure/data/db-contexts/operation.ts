import {IAggregateRoot} from '../../../domain';
import {Crud} from './crud';
import {IOperation} from './operation.interface';

export class Operation<T extends IAggregateRoot<TId>, TId>
  implements IOperation
{
  crud: Crud;
  aggregateRoot: T;
  commitMethod: () => void;
  rollbackMethod: () => void;

  constructor(
    crud: Crud,
    aggregateRoot: T,
    commitMethod: () => void,
    rollbackMethod: () => void,
  ) {
    this.crud = crud;
    this.aggregateRoot = aggregateRoot;
    this.commitMethod = commitMethod;
    this.rollbackMethod = rollbackMethod;
  }
}
