export class DomainError extends Error {
  /**
   * Protected constructor to prevent direct instantiation.
   */
  constructor(errorMessage: string, propertyName?: string) {
    super(errorMessage);
    if (propertyName) {
      this.name = propertyName;
    }
    this.message = errorMessage;
  }

  /**
   * Creates a new Error.
   * @param errorMessage The error message.
   * @param propertyName The name of the property.
   * @returns A new Error instance.
   */
  public static create(
    errorMessage: string,
    propertyName?: string,
  ): DomainError {
    return new DomainError(errorMessage, propertyName);
  }
}
