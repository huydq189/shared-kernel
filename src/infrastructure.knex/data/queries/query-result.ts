import {IPagedList, PagedList, PageOptions} from '../../../application';
import {IDbConnectionFactory} from '../connection-factory';

export class QueryResult {
  private readonly dbConnectionFactory: IDbConnectionFactory;
  private readonly parameters: any;
  private readonly countQuery: string;
  private readonly pagedQuery: string;

  constructor(
    parameters: any,
    query: string,
    tempTables: string,
    state: PageOptions,
    dbConnectionFactory: IDbConnectionFactory,
  ) {
    this.dbConnectionFactory = dbConnectionFactory;

    const parameterProperties = parameters.ParameterNames.map(
      (p: string) => '@' + p,
    );

    const parametersNotFound = query
      .replace(/\n|\r|\t/g, ' ')
      .replace(')', ' )')
      .split(' ')
      .filter(word => word.startsWith('@'))
      .filter(parameter => !parameterProperties.includes(parameter))
      .map(parameter => `Parameter ${parameter} not found`);

    if (parametersNotFound.length > 0) {
      throw new Error(parametersNotFound.join(', '));
    }

    this.parameters = parameters;
    this.countQuery = `${tempTables} SELECT COUNT(1) FROM (${query}) AS ALIAS`;
    this.pagedQuery = `${tempTables} ${query}`;

    if (state.orders && state.orders.length > 0) {
      this.pagedQuery += `\nORDER BY ${state.orders.map(order => `${order.field} ${order.ascending ? '' : 'DESC'}`).join(', ')}`;
    }

    if (state.take !== undefined) {
      this.pagedQuery += `\nOFFSET ${state.skip ?? 0} ROWS\nFETCH NEXT ${state.take} ROWS ONLY`;
    }
  }

  public async toPagedListAsync<TResult>(): Promise<IPagedList<TResult>> {
    const connection = this.dbConnectionFactory.getConnection();

    const totalResult = await connection.raw(this.countQuery, this.parameters);
    const total = totalResult.rows[0].count;

    if (total === 0) {
      return PagedList.empty<TResult>();
    }

    const elementsResult = await connection.raw(
      this.pagedQuery,
      this.parameters,
    );
    const elements = elementsResult.rows;

    return new PagedList<TResult>(total, elements);
  }
}
