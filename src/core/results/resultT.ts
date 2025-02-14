/**
 * T Result class.
 */
export class ResultT<T> {
  public readonly value: T;
  public readonly errors: Error[];

  constructor(value: T);
  constructor(errors: Error[]);
  constructor(valueOrErrors: T | Error[]) {
    if (Array.isArray(valueOrErrors)) {
      if (valueOrErrors.length === 0) {
        throw new Error('At least one error is required.');
      }
      this.errors = valueOrErrors;
      this.value = null as unknown as T;
    } else {
      this.value = valueOrErrors;
      this.errors = [];
    }
  }

  /**
   * Returns true if the result is successful.
   */
  public get isSuccess(): boolean {
    return this.errors.length === 0;
  }

  /**
   * Returns true if the result is a failure.
   */
  public get isFailure(): boolean {
    return this.errors.length > 0;
  }

  /**
   * Creates an empty result.
   */
  public static empty<T>(): ResultT<T | null> {
    return new ResultT<T | null>(null);
  }

  /**
   * Creates a success result.
   */
  public static create<T>(value: T): ResultT<T> {
    return new ResultT<T>(value);
  }

  /**
   * Creates a failure result.
   */
  public static createFailure<T>(errors: Error[]): ResultT<T> {
    return new ResultT<T>(errors);
  }

  /**
   * Implicit conversion for values.
   */
  public static fromValue<T>(value: T): ResultT<T> {
    return new ResultT<T>(value);
  }
}
