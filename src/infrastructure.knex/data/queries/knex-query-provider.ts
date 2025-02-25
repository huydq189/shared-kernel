import {PagedList, PageOptions} from '../../../application';
import {IDbConnectionFactory} from '../connection-factory';

export class KnexQueryProvider {
  readonly #dbConnectionFactory: IDbConnectionFactory;

  constructor(dbConnectionFactory: IDbConnectionFactory) {
    this.#dbConnectionFactory = dbConnectionFactory;
  }

  async executeQueryFirst(sql: string, parameters: Record<string, any> = {}) {
    const result = await this.executeQuery(sql, parameters);
    return result[0];
  }

  async executeQuery<T>(
    sql: string,
    parameters: Record<string, any> = {},
  ): Promise<T[]> {
    const client = this.#dbConnectionFactory.getConnection();
    return (await client.raw<T>(sql, parameters)) as Promise<T[]>;
  }

  async toPagedList<T>(
    sql: string,
    parameters: Record<string, any>,
    pageOptions: PageOptions,
    preselect: string = '',
  ): Promise<PagedList<T>> {
    let pre = '';
    if (preselect.trim()) {
      pre = `${preselect} \n`;
    }

    const client = this.#dbConnectionFactory.getConnection();
    const queryCountString = `${preselect}SELECT COUNT(1) FROM (${sql}) ALIAS`;
    const result = await client.raw<number[]>(queryCountString, parameters);
    const total = result[0];

    if (total) return PagedList.empty<T>();

    let paginatedQuery = `${preselect}${sql}`;
    if (pageOptions.orders && pageOptions.orders.length > 0) {
      const orderBy = pageOptions.orders
        .map(order => `${order.field} ${order.ascending ? '' : 'DESC'}`)
        .join(', ');
      paginatedQuery += ` ORDER BY ${orderBy}`;
    }

    if (pageOptions.take) {
      paginatedQuery += ` OFFSET ${pageOptions.skip} ROWS FETCH NEXT ${pageOptions.take} ROWS ONLY`;
    }

    const elementsResult = await client.raw<T[]>(paginatedQuery, parameters);
    return new PagedList<T>(total, elementsResult[0] || []);
  }

  async executeSpMultiple<T>(
    storedProcedure: string,
    parameters: Record<string, any> = {},
  ): Promise<T[]> {
    const client = this.#dbConnectionFactory.getConnection();
    const result = await client.raw<T[]>(
      `CALL ${storedProcedure}(:...parameters)`,
      parameters,
    );
    return result[0] || [];
  }
}
