import {DbContext} from '../../../infrastructure/data';

export interface IDbConnectionFactory<TContext extends DbContext> {
  createDbContext(): TContext;
}
