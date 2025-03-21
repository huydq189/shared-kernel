import {DbContext} from '..';

export interface IDbConnectionFactory<TContext extends DbContext> {
  createDbContext(): TContext;
}
