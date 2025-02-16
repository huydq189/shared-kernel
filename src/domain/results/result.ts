import {DomainError} from './error';
import {Unit} from './unit';

export class Result<T> {
  public readonly value: T;
  public readonly errors: Error[];

  private constructor(value: T, errors: Error[] = []) {
    this.value = value;
    this.errors = errors;
  }

  public static readonly unit = Unit.value;

  public static empty<T>(): Result<T | null> {
    return new Result<T | null>(null);
  }

  public static create<T>(value: T): Result<T> {
    return new Result(value);
  }

  public static createWithErrors<T>(errors: Error[]): Result<T> {
    if (!errors || errors.length === 0) {
      throw new Error('At least one error.');
    }
    return new Result<T>(null as any, errors);
  }

  public get isSuccess(): boolean {
    return this.errors.length === 0;
  }

  public get isFailure(): boolean {
    return this.errors.length > 0;
  }

  public static success<T>(value: T): Result<T> {
    return Result.create(value);
  }

  public static failure<T>(errors: Error[]): Result<T> {
    return Result.createWithErrors(errors);
  }

  public static failureSingle<T>(error: Error): Result<T> {
    return Result.createWithErrors([error]);
  }

  public static successUnit(): Result<Unit> {
    return Result.create(Unit.value);
  }

  public static failureUnit(errors: Error[]): Result<Unit> {
    return Result.createWithErrors(errors);
  }

  public static failureUnitSingle(error: Error): Result<Unit> {
    return Result.createWithErrors([error]);
  }

  public static notFound(): Result<Unit> {
    return Result.create(Unit.value);
  }

  public bind<TU>(predicate: (value: T) => Result<TU>): Result<TU> {
    return this.isSuccess ? predicate(this.value) : Result.failure(this.errors);
  }

  public tryBind<TU>(
    predicate: (value: T) => TU,
    capture?: (error: Error) => Result<TU>,
    finallyFunc?: () => void,
  ): Result<TU> {
    if (!this.isSuccess) return Result.failure(this.errors);

    let resultError: Result<TU>;
    try {
      return Result.success(predicate(this.value));
    } catch (error) {
      resultError = capture
        ? capture(error as Error)
        : Result.failure([error as Error]);
    } finally {
      if (finallyFunc) finallyFunc();
    }

    return resultError;
  }

  public tryBindWithException<TU, TException extends DomainError>(
    predicate: (value: T) => TU,
    captureCustom: (error: TException) => Result<TU>,
    capture?: (error: Error) => Result<TU>,
    finallyFunc?: () => void,
  ): Result<TU> {
    if (!this.isSuccess) return Result.failure(this.errors);

    let resultError: Result<TU>;
    try {
      return Result.success(predicate(this.value));
    } catch (error) {
      if (error instanceof DomainError) {
        resultError = captureCustom(error as TException);
      } else {
        resultError = capture
          ? capture(error as Error)
          : Result.failure([error as Error]);
      }
    } finally {
      if (finallyFunc) finallyFunc();
    }

    return resultError;
  }

  public combine<T>(...results: Result<T>[]): Result<T[]> {
    const resultList = results;
    return resultList.every(r => r.isSuccess)
      ? Result.success(resultList.map(r => r.value))
      : Result.failure(resultList.flatMap(r => r.errors));
  }

  public ensure<T>(
    result: Result<T>,
    predicate: (value: T) => boolean,
    error: Error,
  ): Result<T> {
    if (result.isFailure) {
      return result;
    }

    return predicate(result.value) ? result : Result.failure([error]);
  }

  public ensureAppendError<T>(
    result: Result<T>,
    predicate: (value: T) => boolean,
    error: Error,
  ): Result<T> {
    if (predicate(result.value)) {
      return result;
    }

    const errors = [...result.errors, error];
    return Result.failure(errors);
  }

  public map<T, TU>(result: Result<T>, mapper: (value: T) => TU): Result<TU> {
    return result.isSuccess
      ? Result.success(mapper(result.value))
      : Result.failure(result.errors);
  }

  public tap<T>(result: Result<T>, predicate: (value: T) => void): Result<T> {
    if (result.isSuccess) {
      predicate(result.value);
    }
    return result;
  }
}
