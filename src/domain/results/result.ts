import {DomainError} from './error';
import {Unit} from './unit';

export class Result<T> {
  public readonly value?: T;
  public readonly errors: DomainError[];

  private constructor(value?: T, errors: DomainError[] = []) {
    this.value = value;
    this.errors = errors;
  }

  get isSuccess(): boolean {
    return this.errors.length === 0;
  }

  get isFailure(): boolean {
    return this.errors.length > 0;
  }

  public static create<T>(value: T): Result<T> {
    return new Result(value);
  }

  public static errors<T>(errors: DomainError[]): Result<T> {
    if (!errors || errors.length === 0) {
      throw new Error('At least one error is required.');
    }
    return new Result<T>(undefined, errors);
  }

  public static error<T>(error: DomainError): Result<T> {
    return Result.errors([error]);
  }

  public static empty<T = undefined | null>(): Result<T> {
    return new Result<T>();
  }
}

export class ResultFactory {
  // Static readonly Unit property
  static readonly Unit = Unit.Value;

  // Static method to create an empty Result
  static Empty<T>(): Result<T | null> {
    return Result.empty<T>();
  }

  static create<T>(value: T): Result<T> {
    return Result.create(value);
  }

  static success<T>(value: T): Result<T> {
    return Result.create(value);
  }

  // Static method to create a failure Result with multiple errors
  static Failure<T>(errors: AppError[]): Result<T> {
    return Result.CreateWithErrors(errors);
  }

  // Static method to create a failure Result with a single error
  static FailureSingle<T>(error: AppError): Result<T> {
    return Result.CreateWithErrors([error]);
  }

  // Static method to create a successful Result with Unit value
  static SuccessUnit(): Result<Unit> {
    return Result.Create(Unit.Value);
  }

  // Static method to create a failure Result with multiple errors and Unit type
  static FailureUnit(errors: AppError[]): Result<Unit> {
    return Result.CreateWithErrors(errors);
  }

  // Static method to create a failure Result with a single error and Unit type
  static FailureUnitSingle(error: AppError): Result<Unit> {
    return Result.CreateWithErrors([error]);
  }

  // Static method to create a NotFound Result with Unit type
  static NotFound(): Result<Unit> {
    return Result.Create(Unit.Value);
  }
}
