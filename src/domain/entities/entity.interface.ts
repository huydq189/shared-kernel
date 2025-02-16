import {TId} from '../../core';

/**
 * @interface
 * @description Represents an entity with unique properties and lifecycle operations.
 * @template Props The type of the entity's properties.
 */
export interface IEntity<T = string> {
  id: TId<T>;
  equal(object?: IEntity<T>): boolean;
}
