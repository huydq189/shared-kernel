export abstract class DomainEventBase {
  public readonly dateOccurred: Date

  constructor() {
    this.dateOccurred = new Date()
  }
}