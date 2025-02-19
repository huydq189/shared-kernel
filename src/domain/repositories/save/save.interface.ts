import {Result} from '../../../core';

export interface ISaveRepository {
  saveChanges(): number;

  saveChangesResult(): Result<number>;

  rollback(): number;

  rollbackResult(): Result<number>;
}
