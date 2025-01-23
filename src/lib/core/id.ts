import {v4 as uuidv4} from 'uuid';
import {TId} from './id.interface';

/**
 * @description Represents a unique identifier for Entities or Aggregates, providing methods
 * to generate and manipulate ID values, including the ability to create new IDs, convert them
 * to a shorter format, clone them, and check for equality.
 */
export class Id<T = string> implements TId<T> {
  private _value: string;

  constructor(id?: T) {
    if (typeof id === 'undefined') {
      const uuid = uuidv4();
      this._value = uuid;
      return this;
    }

    this._value = typeof id === 'string' ? id : String(id);
    return this;
  }

  /**
   * @description Retrieves the current ID value.
   * @returns The ID value as a string.
   */
  value(): string {
    return this._value;
  }

  /**
   * @description Compares the current ID against another `UID` instance by value.
   * @param id Another `UID` to compare to.
   * @returns `true` if both IDs share the same value type and string value, otherwise `false`.
   */
  equal(id: TId<unknown>): boolean {
    return (
      typeof this._value === typeof id?.value() && this._value === id?.value()
    );
  }
}
