import {DomainError} from './error';
import {Unit} from './unit';

export class Result<T> {
  public readonly value: T;
  public readonly errors: DomainError[];

  private constructor(value?: T, errors: DomainError[] = []) {
    this.value = value ?? (Unit.value as T);
    this.errors = errors;
  }

  public get isSuccess(): boolean {
    return this.errors.length === 0;
  }

  public get isFailure(): boolean {
    return this.errors.length > 0;
  }

  public static create<T>(): Result<T> {
    return new Result<T>();
  }

  public static ok<T>(value: T): Result<T> {
    return new Result<T>(value);
  }

  public static fail<T>(...errors: DomainError[]): Result<T> {
    if (!errors || errors.length === 0) {
      throw new Error('InvalidOperation: At least one error.');
    }
    return new Result<T>(undefined, errors);
  }

  public bind<TU>(predicate: (value: T) => Result<TU>): Result<TU> {
    return this.isSuccess ? predicate(this.value) : Result.fail(...this.errors);
  }

  public tryBind<TU>(
    predicate: (value: T) => TU,
    capture?: (error: Error) => Result<TU>,
    finallyFunc?: () => void,
  ): Result<TU> {
    if (!this.isSuccess) {
      return Result.fail(...this.errors);
    }

    let resultError: Result<TU>;

    try {
      return Result.ok(predicate(this.value));
    } catch (error) {
      resultError = capture
        ? capture(error as Error)
        : Result.fail(DomainError.create((error as Error).message));
    } finally {
      finallyFunc?.();
    }

    return resultError;
  }

  public tryBindCapture<TU, TException extends Error>(
    predicate: (value: T) => Result<TU>,
    captureCustom: (error: TException) => Result<TU>,
    exception: new (...args: any[]) => TException,
    capture?: (error: Error) => Result<TU>,
    finallyFunc?: () => void,
  ): Result<TU> {
    if (!this.isSuccess) {
      return Result.fail(...this.errors);
    }

    let resultError: Result<TU>;

    try {
      return predicate(this.value);
    } catch (error) {
      if (error instanceof exception) {
        resultError = captureCustom(error as TException);
      } else {
        resultError = capture
          ? capture(error as Error)
          : Result.fail(DomainError.create((error as Error).message));
      }
    } finally {
      finallyFunc?.();
    }

    return resultError;
  }

  public combine<T1, T2>(
    result1: Result<T1>,
    result2: Result<T2>,
  ): Result<[T, T1, T2]> {
    if (!this.isFailure && !result1.isFailure && !result2.isFailure) {
      return Result.ok<[T, T1, T2]>([this.value, result1.value, result2.value]);
    }

    return Result.fail<[T, T1, T2]>(
      ...this.errors.concat(result1.errors).concat(result2.errors),
    );
  }

  public tap(predicate: (value: T) => void): Result<T> {
    if (this.isSuccess) {
      predicate(this.value);
    }
    return this;
  }
}
