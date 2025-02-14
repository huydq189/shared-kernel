import {IAggregateRoot} from '../../aggregates';

export interface ICreateRepository<TAggregate extends IAggregateRoot> {
  /**
   * Add a single aggregate root.
   */
  add(aggregateRoot: TAggregate): void;

  /**
   * Add multiple aggregate roots.
   */
  addRange(aggregates: TAggregate[]): void;
}
