export class ValidationResult {
  readonly #memberNames: string[];

  constructor(
    public errorMessage: string,
    memberNames: string[] = [],
  ) {
    this.#memberNames = memberNames;
  }

  /** Getter for member names */
  getMemberNames(): string[] {
    return this.#memberNames;
  }

  /** Returns error message as string */
  toString(): string {
    return this.errorMessage;
  }
}
