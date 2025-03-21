import {Result} from '../../domain';
import {Id} from '../core';

export interface IUnitOfWork {
  id: Id;

  /** . */
  saveChanges(): number;

  /** . */
  saveChangesResult(): Result<number>;

  /** . */
  rollback(): number;

  /** . */
  rollbackResult(): Result<number>;
}
