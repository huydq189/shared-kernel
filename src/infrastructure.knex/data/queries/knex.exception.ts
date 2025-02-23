export class KnexException extends Error {
  constructor(message: string) {
    super('KnexException: ' + message);
  }
}
