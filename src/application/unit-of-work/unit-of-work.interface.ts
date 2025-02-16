import {Id, ResultT} from '../../core';

export interface IUnitOfWork {
  id: Id;

  /** . */
  saveChanges(): number;

  /** . */
  saveChangesResult(): ResultT<number>;

  /** . */
  rollback(): number;

  /** . */
  rollbackResult(): ResultT<number>;
}
