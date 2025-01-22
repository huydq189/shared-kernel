import {v4 as uuidv4} from 'uuid';

export abstract class Request {
  public readonly requestId: string;
  public readonly occurredOn: Date;

  protected constructor();
  protected constructor(
    requestId: string = uuidv4(),
    occurredOn: Date = new Date(),
  ) {
    this.requestId = requestId;
    this.occurredOn = occurredOn;
  }

  public abstract getUniqueName(): string;

  public abstract fromPrimitives(
    body: Record<string, string>,
    id: string,
    occurredOn: string,
  ): Request;
}
