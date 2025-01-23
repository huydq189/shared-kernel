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
    return new Result<T>(undefined, errors);
  }

  // Static method to create an empty result
  public static empty<T>(): Result<T | null> {
    return new Result<T | null>(null);
  }

  // Implicit conversion helper
  public static implicit<T>(value: T): Result<T> {
    return this.create(value);
  }
}
