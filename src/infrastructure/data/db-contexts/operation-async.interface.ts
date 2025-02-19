import {IAggregateRoot} from '../../../domain';
import {Crud} from './crud';

export interface IOperationAsync {
  crud: Crud;
  commitMethodAsync: () => Promise<void>;
  rollbackMethodAsync: () => Promise<void>;
  aggregateRoot: IAggregateRoot;
}
