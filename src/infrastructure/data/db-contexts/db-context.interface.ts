import {IUnitOfWork} from '../../../application/unit-of-work/unit-of-work.interface';
import {IAggregateRoot} from '../../../domain';

export interface IDbContext extends IUnitOfWork {
  add<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    aggregateRoot: TAggregateRoot,
  ): void;
  update<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    aggregateRoot: TAggregateRoot,
  ): void;
  delete<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    aggregateRoot: TAggregateRoot,
  ): void;
}
