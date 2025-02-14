import {ResultT} from '../../core';

export interface IUnitOfWork {
  /** . */
  id: string; // Guid is replaced with string for UUID in TypeScript

  /** . */
  saveChanges(): number;

  /** . */
  saveChangesResult(): ResultT<number>;

  /** . */
  rollback(): number;

  /** . */
  rollbackResult(): ResultT<number>;
}
