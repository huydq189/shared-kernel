import {IAggregateRoot} from '../../../domain';
import {IDbContext} from './db-context.interface';

export interface IDbContextAsync extends IDbContext {
  addAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void>;
  updateAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void>;
  deleteAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void>;
}
