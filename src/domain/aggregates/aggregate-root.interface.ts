import {TId} from '../../core';
import {DomainEvent} from '../events';

export interface IAggregateRoot<T = string> {
  id: TId<T>;
  pullDomainEvents(): DomainEvent[];
}
