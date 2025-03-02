import {DbContext} from '../../../infrastructure';

export class KnexQueryProvider<TDbContextBase extends DbContext> {
  private _factory: IDbContextFactory<TDbContextBase>;
  private _lastDbContext!: TDbContextBase;
  private _dbContexts: TDbContextBase[];

  constructor(factory: IDbContextFactory<TDbContextBase>) {
    this._factory = factory;
    this._dbContexts = [];
  }

  public getQuery<TEntity>(showDeleted = false): IQueryable<TEntity> {
    this._lastDbContext = this.getDbContext();
    return this.set<TEntity>(showDeleted);
  }

  public set<TEntity>(showDeleted = false): IQueryable<TEntity> {
    if (!this._lastDbContext) {
      throw new Error("It is required to call the 'GetQuery' method before");
    }

    return this._lastDbContext
      .set<TEntity>()
      .asNoTracking()
      .where(showDeleted, false);
  }

  private getDbContext(): TDbContextBase {
    const dbContext = this._factory.createDbContext();
    this._dbContexts.push(dbContext);
    return dbContext;
  }

  public async toPagedListAsync<T, TResult>(
    pageOptions: PageOptions,
    domainSpecification?: ISpecification<T>,
    dtoSpecification?: ISpecification<TResult>,
    selector?: Expression<Func<T, TResult>>,
    cancellationToken: CancellationToken = new CancellationToken(),
  ): Promise<PagedList<TResult>> {
    const dbContext =
      await this._factory.createDbContextAsync(cancellationToken);
    this._dbContexts.push(dbContext);

    let query = dbContext.set<T>().asNoTracking();

    if (
      pageOptions.showDeleted &&
      !pageOptions.showDeleted &&
      (typeof (T as any).prototype) instanceof IEntityAuditableLogicalRemove
    ) {
      query = query
        .cast<IEntityAuditableLogicalRemove>()
        .where(
          new NotDeletedSpecification<IEntityAuditableLogicalRemove>().satisfiedBy(),
        )
        .cast<T>();
    }
    if (
      pageOptions.showDeleted &&
      pageOptions.showOnlyDeleted &&
      pageOptions.showDeleted &&
      pageOptions.showOnlyDeleted &&
      (typeof (T as any).prototype) instanceof IEntityAuditableLogicalRemove
    ) {
      query = query
        .cast<IEntityAuditableLogicalRemove>()
        .where(
          new DeletedSpecification<IEntityAuditableLogicalRemove>().satisfiedBy(),
        )
        .cast<T>();
    }
    if (domainSpecification) {
      query = query.where(domainSpecification.satisfiedBy());
    }

    let queryDto = selector
      ? query.select(selector)
      : query.projectTo<TResult>();

    if (pageOptions.filterProperties) {
      const propertiesSpec =
        new PropertiesContainsOrEqualSpecification<TResult>(
          pageOptions.filterProperties.map(
            p => new Property(p.field, p.value, undefined, true),
          ),
        );

      queryDto = queryDto.where(propertiesSpec.satisfiedBy());
    }

    if (pageOptions.searchText && pageOptions.searchText.trim()) {
      const searchTextSpec = new ObjectContainsOrEqualSpecification<TResult>(
        pageOptions.searchText,
      );

      queryDto = queryDto.where(searchTextSpec.satisfiedBy());
    }

    if (dtoSpecification) {
      queryDto = queryDto.where(dtoSpecification.satisfiedBy());
    }

    const totalAfter = await queryDto.countAsync(cancellationToken);

    const elements = await queryDto
      .orderAndPaged(pageOptions)
      .toListAsync(cancellationToken);

    return new PagedList<TResult>(totalAfter, elements);
  }
}
