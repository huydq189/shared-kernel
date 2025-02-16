export class DomainError {
  /**
   * The name of the property.
   */
  public propertyName?: string;

  /**
   * The error message.
   */
  public errorMessage: string;

  /**
   * Protected constructor to prevent direct instantiation.
   */
  protected constructor(errorMessage: string, propertyName?: string) {
    this.propertyName = propertyName;
    this.errorMessage = errorMessage;
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
