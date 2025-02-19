import {Result} from '../../../core';
import {IAggregateRoot, IRepository, ISaveRepository} from '../../../domain';
import {IDbContext} from '../db-contexts';

export abstract class Repository<
    TAggregateRoot extends IAggregateRoot<TId>,
    TId,
  >
  implements IRepository<TAggregateRoot, TId>, ISaveRepository
{
  private readonly _dbContext: IDbContext;

  protected constructor(dbContext: IDbContext) {
    if (!dbContext) {
      throw new Error('ArgumentNull: dbContext is required');
    }
    this._dbContext = dbContext;
  }

  public add(aggregateRoot: TAggregateRoot): void {
    this._dbContext.add<TAggregateRoot, TId>(aggregateRoot);
  }

  public addRange(aggregates: TAggregateRoot[]): void {
    aggregates.forEach(aggregateRoot => this.add(aggregateRoot));
  }

  public getById(id: TId): TAggregateRoot | null {
    return this._dbContext.getById(id);
  }

  public any(id: TId): boolean {
    return this.getById(id) !== null;
  }

  public notAny(id: TId): boolean {
    return this.getById(id) === null;
  }

  public update(aggregateRoot: TAggregateRoot): void {
    this._dbContext.update<TAggregateRoot, TId>(aggregateRoot);
  }

  public updateRange(aggregates: TAggregateRoot[]): void {
    aggregates.forEach(aggregateRoot => this.update(aggregateRoot));
  }

  public remove(aggregateRoot: TAggregateRoot): void {
    this._dbContext.remove(aggregateRoot);
  }

  public removeRange(aggregates: TAggregateRoot[]): void {
    aggregates.forEach(aggregateRoot => this.remove(aggregateRoot));
  }

  public saveChanges(): number {
    return this._dbContext.saveChanges();
  }

  public saveChangesResult(): Result<number> {
    return this._dbContext.saveChangesResult();
  }

  public rollback(): number {
    return this._dbContext.rollback();
  }

  public rollbackResult(): Result<number> {
    return this._dbContext.rollbackResult();
  }
}
