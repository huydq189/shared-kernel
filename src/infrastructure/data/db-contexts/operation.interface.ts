import {IAggregateRoot} from '../../../domain';
import {Crud} from './crud';

export interface IOperation {
  crud: Crud;
  commitMethod: () => void;
  rollbackMethod: () => void;
  aggregateRoot: IAggregateRoot;
}
