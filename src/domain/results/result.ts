import {DomainError} from './error';
import {Unit} from './unit';

export class Result<T> {
  public static readonly unit = Unit.value;
  public readonly value: T;
  public readonly errors: DomainError[] = [];

  private constructor(value: T, errors: DomainError[] = []) {
    this.value = value;
    this.errors = errors;
  }

  public get isSuccess(): boolean {
    return this.errors && this.errors.length === 0;
  }

  public get isFailure(): boolean {
    return this.errors && this.errors.length > 0;
  }

  public static ok<T>(value: T): Result<T> {
    return new Result<T>(value);
  }

  public static fail<T>(errors: DomainError[]) {
    if (!errors) {
      throw new Error('InvalidOperation: At least one error.');
    }
    if (errors?.length === 0) {
      throw new Error('InvalidOperation: At least one error.');
    }

    return new Result<T>(errors);
  }

  public static bind<T, TU>(
    result: Result<T>,
    predicate: (value: T) => Result<TU>,
  ) {
    return result.isSuccess
      ? predicate(result.value)
      : Result.fail(result.errors);
  }
}
