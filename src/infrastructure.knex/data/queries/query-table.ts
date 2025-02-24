export type QueryTableProps = {
  name: string;
  key: string;
  schema?: string;
  alias?: string;
};

export class QueryTable {
  public readonly schema: string;
  public readonly name: string;
  public readonly key: string;
  public readonly alias?: string;

  constructor({name, key, schema = 'dbo', alias}: QueryTableProps) {
    this.schema = schema;
    this.name = name;
    this.key = key;
    this.alias = alias;
  }

  public toString() {
    return !this.alias
      ? `${this.schema}.${this.name} AS ${this.alias}`
      : `${this.schema}.${this.name}`;
  }

  public get join(): string {
    return this.alias
      ? `${this.alias}.${this.key}`
      : `${this.schema}.${this.name}.${this.key}`;
  }
}
