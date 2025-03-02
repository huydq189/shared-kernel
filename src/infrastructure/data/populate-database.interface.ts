// Example interface for database population
export interface IPopulateDatabase {
  /**
   * Populates the database with necessary data, potentially with migrations.
   * @param cancellationToken An AbortSignal that allows cancellation of the operation.
   */
  populate(): Promise<void>;
}
