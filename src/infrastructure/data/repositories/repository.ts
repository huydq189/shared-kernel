import {
  IAggregateRoot,
  IRepository,
  ISaveRepository,
  Result,
} from '../../../domain';
import {IDbContext} from '../db-contexts';

export abstract class Repository<
    TAggregateRoot extends IAggregateRoot<TId>,
    TId,
  >
  implements IRepository<TAggregateRoot, TId>, ISaveRepository
{
  readonly #dbContext: IDbContext;

  protected constructor(dbContext: IDbContext) {
    if (!dbContext) {
      throw new Error('ArgumentNull: dbContext is required');
    }
    this.#dbContext = dbContext;
  }

  public add(aggregateRoot: TAggregateRoot): void {
    this.#dbContext.add<TAggregateRoot, TId>(aggregateRoot);
  }

  public addRange(aggregates: TAggregateRoot[]): void {
    aggregates.forEach(aggregateRoot => this.add(aggregateRoot));
  }

  public getById(id: TId): TAggregateRoot | null {
    return this.#dbContext.getById(id);
  }

  public any(id: TId): boolean {
    return this.getById(id) !== null;
  }

  public notAny(id: TId): boolean {
    return this.getById(id) === null;
  }

  public update(aggregateRoot: TAggregateRoot): void {
    this.#dbContext.update<TAggregateRoot, TId>(aggregateRoot);
  }

  public updateRange(aggregates: TAggregateRoot[]): void {
    aggregates.forEach(aggregateRoot => this.update(aggregateRoot));
  }

  public remove(aggregateRoot: TAggregateRoot): void {
    this.#dbContext.remove(aggregateRoot);
  }

  public removeRange(aggregates: TAggregateRoot[]): void {
    aggregates.forEach(aggregateRoot => this.remove(aggregateRoot));
  }

  public saveChanges(): number {
    return this.#dbContext.saveChanges();
  }

  public saveChangesResult(): Result<number> {
    return this.#dbContext.saveChangesResult();
  }

  public rollback(): number {
    return this.#dbContext.rollback();
  }

  public rollbackResult(): Result<number> {
    return this.#dbContext.rollbackResult();
  }
}
