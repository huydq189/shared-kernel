/**
 * @interface
 * @description Represents a unique identifier (UID) with methods for manipulation and comparison.
 * @template T The type of the UID's value (default: string).
 */
export interface TId<T = string> {
  value(): string;
  equal(id: TId<T>): boolean;
}
