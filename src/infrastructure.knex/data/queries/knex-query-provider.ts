import {Knex} from 'knex';

export class KnexQueryProvider {
  private readonly logger: any;
  private readonly db: Knex;

  constructor(logger: any, db: Knex) {
    this.logger = logger;
    this.db = db;
  }

  async executeQueryFirstOrDefault<T>(
    sql: string,
    parameters?: any,
  ): Promise<T | null> {
    this.logger.verbose(sql);
    const result = await this.db.raw<T[]>(sql, parameters);
    return result.length > 0 ? result[0] : null;
  }

  async executeQuery<T>(sql: string, parameters?: any): Promise<T[]> {
    this.logger.verbose(sql);
    const result = await this.db.raw<T[]>(sql, parameters);
    return result.rows;
  }

  async toPagedList<T>(
    sql: string,
    parameters: any,
    pageOptions: any,
    preselect?: string,
  ): Promise<any> {
    let pre = preselect ? `${preselect} \n` : '';

    const queryCountString = `${pre}SELECT COUNT(1) FROM (${sql}) AS ALIAS`;
    this.logger.verbose(queryCountString);
    const total =
      (await this.db.raw<{count: number}[]>(queryCountString, parameters))
        .rows[0]?.count || 0;

    if (total === 0) return PagedList.empty<T>();

    let queryString = `${preselect || ''}${sql}`;
    if (pageOptions.orders?.length) {
      const orders = pageOptions.orders
        .map(order => `${order.field} ${order.ascending ? '' : 'DESC'}`)
        .join(', ');
      queryString += `\nORDER BY ${orders}`;
    }

    if (pageOptions.take) {
      queryString += `\nOFFSET ${pageOptions.skip} ROWS FETCH NEXT ${pageOptions.take} ROWS ONLY`;
    }

    this.logger.verbose(queryString);
    const elements = await this.db.raw<T[]>(queryString, parameters);
    return new PagedList<T>(total, elements.rows);
  }

  async executeStoredProcedure<T>(
    storedProcedure: string,
    parameters?: any,
  ): Promise<T[]> {
    this.logger.verbose(`Executing stored procedure: ${storedProcedure}`);
    const result = await this.db.raw<T[]>(
      `CALL ${storedProcedure}`,
      parameters,
    );
    return result.rows;
  }
}
