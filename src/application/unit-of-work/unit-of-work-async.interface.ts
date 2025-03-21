import {Result} from '../../domain';
import {IUnitOfWork} from './unit-of-work.interface';

export interface IUnitOfWorkAsync extends IUnitOfWork {
  /** . */
  saveChangesAsync(): Promise<number>;

  /** . */
  saveChangesResultAsync(): Promise<Result<number>>;

  /** . */
  rollbackAsync(): Promise<number>;

  /** . */
  rollbackResultAsync(): Promise<Result<number>>;
}
