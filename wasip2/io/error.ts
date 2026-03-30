export class Error {
  #message: string;

  constructor(message: string) {
    this.#message = message;
  }

  toDebugString(): string {
    return this.#message;
  }
}
