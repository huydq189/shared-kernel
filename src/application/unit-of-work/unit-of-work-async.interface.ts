import {ResultT} from '../../core';
import {IUnitOfWork} from './unit-of-work.interface';

export interface IUnitOfWorkAsync extends IUnitOfWork {
  /** . */
  saveChangesAsync(cancellationToken?: AbortSignal): Promise<number>;

  /** . */
  saveChangesResultAsync(
    cancellationToken?: AbortSignal,
  ): Promise<ResultT<number>>;

  /** . */
  rollbackAsync(cancellationToken?: AbortSignal): Promise<number>;

  /** . */
  rollbackResultAsync(
    cancellationToken?: AbortSignal,
  ): Promise<ResultT<number>>;
}
