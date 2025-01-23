export class Result<T> {
  public readonly value: T | undefined;
  public readonly errors: Error[];

  private constructor(value?: T, errors?: Error[]) {
    if (errors && errors.length === 0) {
      throw new Error('At least one error must be provided.');
    }

    if (errors) {
      this.errors = errors;
      this.value = undefined;
    } else {
      this.value = value;
      this.errors = [];
    }
  }

  // Check if the result is a success
  public get isSuccess(): boolean {
    return this.errors.length === 0;
  }

  // Check if the result is a failure
  public get isFailure(): boolean {
    return this.errors.length > 0;
  }

  // Static method to create a successful result
  public static create<T>(value: T): Result<T> {
    return new Result(value);
  }

  // Static method to create a failed result
  public static createFailure<T>(errors: Error[]): Result<T> {
    if (!errors || errors.length === 0) {
      throw new Error('At least one error must be provided.');
    }
    return new Result(undefined, errors);
  }

  // Static method to create an empty result
  public static empty<T>(): Result<T | null> {
    return new Result<T | null>(null);
  }

  // Static method to create a success result with Unit
  public static success(): Result<Unit> {
    return this.create(Unit.instance);
  }

  // Static method to create a failure result with Unit
  public static failure(errors: Error[]): Result<Unit> {
    return this.createFailure(errors);
  }

  public static failureSingle(error: Error): Result<Unit> {
    return this.createFailure([error]);
  }

  public static notFound(): Result<Unit> {
    return this.success();
  }
}

// Unit class to represent void values
export class Unit {
  public static readonly instance = new Unit();
  private constructor() {}
}

export class ResultExtensions {
  public static success<T>(value: T): Result<T> {
    return Result.create(value);
  }

  public static failure<T>(errors: Error[]): Result<T> {
    return Result.createFailure(errors);
  }

  public static failureSingle<T>(error: Error): Result<T> {
    return Result.createFailure([error]);
  }

  public static empty<T>(): Result<T | null> {
    return Result.empty();
  }

  public static notFound(): Result<Unit> {
    return Result.notFound();
  }
}
