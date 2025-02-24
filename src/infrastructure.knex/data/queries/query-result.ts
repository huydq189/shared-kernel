import { IDbConnectionFactory } from '../connection-factory';
import { DynamicParameters, PageOptions, IPagedList, PagedList } from './types'; // Adjust the import paths as necessary
import { QueryFirstOrDefaultAsync, QueryAsync } from './db-utils'; // Adjust the import paths as necessary

export class QueryResult {
  private readonly dbConnectionFactory: IDbConnectionFactory;
  private readonly parameters: DynamicParameters;
  private readonly countQuery: string;
  private readonly pagedQuery: string;

  constructor(parameters: DynamicParameters, query: string, tempTables: string, state: PageOptions, dbConnectionFactory: IDbConnectionFactory) {
    this.dbConnectionFactory = dbConnectionFactory;

    const parameterProperties = parameters.ParameterNames.map(p => "@" + p);

    const parametersNotFound = query
      .replace(/\n|\r|\t/g, " ")
      .replace(")", " )")
      .split(' ')
      .filter(word => word.startsWith("@"))
      .filter(parameter => !parameterProperties.includes(parameter))
      .map(parameter => `Parameter ${parameter} not found`);

    if (parametersNotFound.length > 0) {
      throw new Error(parametersNotFound.join(", "));
    }

    this.parameters = parameters;
    this.countQuery = `${tempTables} SELECT COUNT(1) FROM (${query}) ALIAS`;
    this.pagedQuery = `${tempTables} ${query}`;

    if (state.Orders && state.Orders.length > 0) {
      this.pagedQuery += `\nORDER BY ${state.Orders.map(order => `${order.Field} ${order.Ascending ? '' : 'DESC'}`).join(", ")}`;
    }

    if (state.Take !== undefined) {
      this.pagedQuery += `\nOFFSET ${state.Skip ?? 0} ROWS\nFETCH NEXT ${state.Take} ROWS ONLY`;
    }
  }

  public async toPagedListAsync<TResult>(cancellationToken: AbortSignal): Promise<IPagedList<TResult>> {
    const connection = await this.dbConnectionFactory.getConnection();
    await connection.openAsync(cancellationToken);

    const total = await QueryFirstOrDefaultAsync<number>(connection, this.countQuery, this.parameters);

    if (total === 0) {
      return PagedList.empty<TResult>();
    }

    const elements = await QueryAsync<TResult>(connection, this.pagedQuery, this.parameters);

    return new PagedList<TResult>(total, elements);
  }
}
