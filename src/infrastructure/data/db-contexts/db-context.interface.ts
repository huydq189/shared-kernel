import {IUnitOfWork} from '../../../application';
import {IAggregateRoot} from '../../../domain';

export interface IDbContext extends IUnitOfWork {
  add<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    aggregateRoot: TAggregateRoot,
  ): void;
  update<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    aggregateRoot: TAggregateRoot,
  ): void;
  remove<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    aggregateRoot: TAggregateRoot,
  ): void;

  getById<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    id: TId,
  ): TAggregateRoot | null;
}
