import {Entity} from '../entities';
import {IDomainEvent} from '../events';

export abstract class AggregateRoot<T> extends Entity<T> {
  #domainEvents: IDomainEvent[] = [];
  public get domainEvents(): IDomainEvent[] {
    return this.#domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this.#domainEvents.push(domainEvent);
    // Add this aggregate instance to the domain event's list of aggregates who's
    // events it eventually needs to dispatch.
    DomainEvents.markAggregateForDispatch(this);
    // Log the domain event
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {
    this.#domainEvents.splice(0, this.#domainEvents.length);
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
  }
}
