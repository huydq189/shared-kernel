export class Unit {
  /**
   * A singleton instance of `Unit`, ensuring only one exists.
   */
  public static readonly Value = new Unit();

  // Private constructor prevents external instantiation.
  private constructor() {}
}
