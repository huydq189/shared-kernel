import {ResultT} from './resultT';
import {Unit} from './unit';

/**
 * Result utility class.
 */
export class Result {
  /**
   * Unit value.
   */
  public static readonly Unit: Unit = Unit.Value;

  /**
   * Returns an empty result.
   */
  public static empty<T>(): ResultT<T | null> {
    return ResultT.empty<T>();
  }

  /**
   * Creates a success result.
   */
  public static create<T>(value: T): ResultT<T> {
    return ResultT.create(value);
  }

  /**
   * Creates a success result from a value.
   */
  public static success<T>(value: T): ResultT<T> {
    return ResultT.create(value);
  }

  /**
   * Creates a failure result with multiple errors.
   */
  public static failure<T>(errors: Error[]): ResultT<T> {
    return ResultT.createFailure(errors);
  }

  /**
   * Creates a failure result with a single error.
   */
  public static failureSingle<T>(error: Error): ResultT<T> {
    return ResultT.createFailure([error]);
  }

  /**
   * Returns a success result for Unit.
   */
  public static successUnit(): ResultT<Unit> {
    return ResultT.create(Unit);
  }

  /**
   * Returns a failure result for Unit.
   */
  public static failureUnit(errors: Error[]): ResultT<Unit> {
    return ResultT.createFailure(errors);
  }

  /**
   * Returns a failure result with a single error for Unit.
   */
  public static failureUnitSingle(error: Error): ResultT<Unit> {
    return ResultT.createFailure([error]);
  }

  /**
   * Returns a not found result.
   */
  public static notFound(): ResultT<Unit> {
    return ResultT.create(Unit);
  }
}
