import {Knex} from 'knex';
export interface IDbConnectionFactory<DbConnection = Knex> {
  getConnection(): DbConnection;
}
