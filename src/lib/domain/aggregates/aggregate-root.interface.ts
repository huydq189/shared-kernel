import {IDomainEvent} from '../events';

/// <summary> This root aggregate contains your domain identifier and events. </summary>
export interface IAggregateRoot {
  pullDomainEvents(): IDomainEvent[];
}
