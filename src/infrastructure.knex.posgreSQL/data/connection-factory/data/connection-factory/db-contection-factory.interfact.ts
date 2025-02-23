import {Knex, knex} from 'knex';
import {IDbConnectionFactory} from '../../../../../infrastructure.knex/data';

export class PostgreSqlConnectionFactory implements IDbConnectionFactory {
  private static instance: Knex | null = null;
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  getConnection(): Knex {
    if (!PostgreSqlConnectionFactory.instance) {
      PostgreSqlConnectionFactory.instance = knex({
        client: 'pg',
        connection: this.connectionString,
      });
    }
    return PostgreSqlConnectionFactory.instance;
  }

  async disconnect(): Promise<void> {
    if (PostgreSqlConnectionFactory.instance) {
      await PostgreSqlConnectionFactory.instance.destroy();
      PostgreSqlConnectionFactory.instance = null;
    }
  }
}
