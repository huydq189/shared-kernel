import {pull} from 'es-toolkit';
import {TId} from '../../core';
import {Entity} from '../entities';
import {DomainEvent} from '../events/domain-event';
import {IAggregateRoot} from './aggregate-root.interface';

export abstract class AggregateRoot<T = string>
  extends Entity<T>
  implements IAggregateRoot<T>
{
  #domainEvents: DomainEvent[] = [];

  constructor(id?: TId<T>) {
    super(id);
    this.#domainEvents = new Array<DomainEvent>();
  }

  get domainEvents(): DomainEvent[] {
    return this.#domainEvents;
  }

  public record(domainEvent: DomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  public pullDomainEvents(): DomainEvent[] {
    this.domainEvents.forEach(e => e.setAggregateId(this.id.value()));
    const events = pull(this.domainEvents, this.domainEvents);
    return events;
  }
}
