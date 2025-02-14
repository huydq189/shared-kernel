import {pull} from 'es-toolkit';
import {Id} from '../../core/id';
import {Entity} from '../entities';
import {DomainEvent} from '../events/domain-event';
import {IAggregateRoot} from './aggregate-root.interface';

export abstract class AggregateRoot<EntityProps>
  extends Entity<EntityProps>
  implements IAggregateRoot
{
  #domainEvents: DomainEvent[] = [];

  constructor(id: Id) {
    super(id);
    this.#domainEvents = new Array<DomainEvent>();
  }

  get domainEvents(): DomainEvent[] {
    return this.#domainEvents;
  }

  record(domainEvent: DomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  pullDomainEvents(): DomainEvent[] {
    this.domainEvents.forEach(e => e.setAggregateId(this.id.value()));
    const events = pull(this.domainEvents, this.domainEvents);
    return events;
  }
}
