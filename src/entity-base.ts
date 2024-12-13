import { DomainEventBase } from './domain-event-base'

export abstract class BaseEntity {
  public id!: number
  private readonly _domainEvents: DomainEventBase[] = []

  get domainEvents(): ReadonlyArray<DomainEventBase> {
    return this._domainEvents
  }

  addDomainEvent(event: DomainEventBase): void {
    this._domainEvents.push(event)
  }

  clearDomainEvents(): void {
    this._domainEvents.length = 0
  }
}
