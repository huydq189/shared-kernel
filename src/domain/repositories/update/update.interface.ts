import {IAggregateRoot} from '../../aggregates';

export interface IUpdateRepository<TAggregate extends IAggregateRoot> {
  /**
   * Updates a single aggregate root.
   * @param aggregateRoot The aggregate root to update.
   */
  update(aggregateRoot: TAggregate): void;

  /**
   * Updates a range of aggregate roots.
   * @param aggregates The aggregate roots to update.
   */
  updateRange(aggregates: TAggregate[]): void;
}
