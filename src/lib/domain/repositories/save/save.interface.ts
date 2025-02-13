import {ResultT} from '../../../core';

export interface ISaveRepository {
  SaveChanges(): number;

  SaveChangesResult(): ResultT<number>;

  Rollback(): number;

  RollbackResult(): ResultT<number>;
}
