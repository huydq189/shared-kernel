import {IAggregateRoot} from '../../aggregates';

/**
 * IReadOneRepository interface.
 */
export interface IReadOneRepository<TAggregate extends IAggregateRoot, TId> {
  /**
   * Get an aggregate root by ID.
   */
  getById(id: TId): TAggregate | null;

  /**
   * Check if an entity with the given ID exists.
   */
  any(id: TId): boolean;

  /**
   * Check if no entity with the given ID exists.
   */
  notAny(id: TId): boolean;
}
