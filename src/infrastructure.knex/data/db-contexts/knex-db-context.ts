import {IAggregateRoot, Result} from '../../../domain';
import {DbContext, IDbContextAsync} from '../../../infrastructure/data';

export abstract class KnexDbContext
  extends DbContext
  implements IDbContextAsync
{
  public getById<TAggregateRoot extends IAggregateRoot, TId>(
    id: TId,
  ): TAggregateRoot | null {
    throw new Error('Method not implemented.');
  }
  protected addMethod<TAggregateRoot extends IAggregateRoot<TId>, TId>(
    aggregateRoot: TAggregateRoot,
  ): void {
    throw new Error('Method not implemented.');
  }
  protected updateMethod<TAggregateRoot extends IAggregateRoot<TId>, TId>(
    aggregateRoot: TAggregateRoot,
  ): void {
    throw new Error('Method not implemented.');
  }
  protected deleteMethod<TAggregateRoot extends IAggregateRoot<TId>, TId>(
    aggregateRoot: TAggregateRoot,
  ): void {
    throw new Error('Method not implemented.');
  }

  public getByIdAsync<TAggregateRoot extends IAggregateRoot<TId>, TId = string>(
    id: TId,
  ): Promise<TAggregateRoot | null> {
    throw new Error('Method not implemented.');
  }

  addAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteAsync<T extends IAggregateRoot>(aggregateRoot: T): Promise<void> {
    throw new Error('Method not implemented.');
  }
  saveChangesAsync(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  saveChangesResultAsync(): Promise<Result<number>> {
    throw new Error('Method not implemented.');
  }
  rollbackAsync(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  rollbackResultAsync(): Promise<Result<number>> {
    throw new Error('Method not implemented.');
  }
}
