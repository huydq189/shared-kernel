import {Entity} from '../entities';
import {IDomainEvent} from '../events';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  #domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this.#domainEvents;
  }

  protected addEvent(domainEvent: IDomainEvent): void {
    this.#domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this.#domainEvents = [];
  }

  public async publishEvents(): Promise<void> {
    this.clearEvents();
  }
}
