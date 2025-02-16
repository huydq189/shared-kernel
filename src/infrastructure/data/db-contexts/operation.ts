import {IAggregateRoot} from '../../../domain';
import {Crud} from './crud';
import {IOperation} from './operation.interface';

export class Operation<TAggregateRoot extends IAggregateRoot<TId>, TId>
  implements IOperation
{
  crud: Crud;
  aggregateRoot: TAggregateRoot;
  commitMethod: () => void;
  rollbackMethod: () => void;

  constructor(
    crud: Crud,
    aggregateRoot: TAggregateRoot,
    commitMethod: () => void,
    rollbackMethod: () => void,
  ) {
    this.crud = crud;
    this.aggregateRoot = aggregateRoot;
    this.commitMethod = commitMethod;
    this.rollbackMethod = rollbackMethod;
  }
}
