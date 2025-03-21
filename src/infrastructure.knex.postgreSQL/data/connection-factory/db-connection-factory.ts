import {Knex, knex} from 'knex';
import {KnexDbContext} from '../../../infrastructure.knex/data/db-contexts/knex-db-context';
import {IDbConnectionFactory} from '../../../infrastructure/data';

export class PostgreSqlConnectionFactory
  implements IDbConnectionFactory<KnexDbContext>
{
  private static instance: Knex | null = null;
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }
  createDbContext(): KnexDbContext {
    throw new Error('Method not implemented.');
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
