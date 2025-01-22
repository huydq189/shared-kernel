import {Id} from '../../core';

export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): Id;
}
