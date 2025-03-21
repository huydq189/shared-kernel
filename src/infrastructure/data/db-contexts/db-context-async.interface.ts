import {IUnitOfWorkAsync} from '../../../application';
import {IAggregateRoot} from '../../../domain';

export interface IDbContextAsync extends IUnitOfWorkAsync {
  addAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void>;
  updateAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void>;
  deleteAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void>;
  getByIdAsync<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    id: TId,
  ): Promise<TAggregateRoot | null>;
}
