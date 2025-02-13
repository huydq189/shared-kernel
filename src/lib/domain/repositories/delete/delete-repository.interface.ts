import {IAggregateRoot} from '../../aggregates';

/**
 * IDeleteRepository interface.
 */
export interface IDeleteRepository<TAggregate extends IAggregateRoot> {
  /**
   * Remove a single aggregate root.
   */
  remove(aggregateRoot: TAggregate): void;

  /**
   * Remove multiple aggregate roots.
   */
  removeRange(aggregates: TAggregate[]): void;
}
