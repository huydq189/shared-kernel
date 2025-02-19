import {Knex} from 'knex';

export interface IDbConnectionFactory {
  getConnection(): Knex;
}
