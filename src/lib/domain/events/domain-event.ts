import {Request} from '../../core';

export type DomainEventProps = {
  aggregateId?: string;
  eventId?: string;
  occurredOn?: Date;
};
export abstract class DomainEvent extends Request {
  #aggregateId?: string;

  constructor(props: DomainEventProps) {
    const {aggregateId, eventId, occurredOn} = props;
    super(eventId, occurredOn);
    if (aggregateId) {
      this.#aggregateId = aggregateId;
    }
  }

  getAggregateId(): string | undefined {
    return this.#aggregateId;
  }

  setAggregateId(id: string): void {
    this.#aggregateId = id;
  }

  abstract getEventName(): string;

  override getUniqueName(): string {
    return this.getEventName();
  }
}
