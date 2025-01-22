import {BuiltIn, ValueObjectProps} from '../types';

/**
 * @interface
 * @description Represents a value object with cloning and transformation capabilities.
 * @template T The type of the value object's properties.
 */
export interface IValueObject<T> {
  value(): Readonly<ValueObjectProps<T>> | (T & BuiltIn);

  /** Converts the value object into a serializable format, optionally using an adapter. */
  compareTo(vo?: this | null): boolean;
}
