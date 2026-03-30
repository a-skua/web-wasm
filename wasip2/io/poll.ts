export class Pollable {
  #ready: boolean;

  constructor(ready = true) {
    this.#ready = ready;
  }

  block(): void {
    // In a synchronous browser environment, this is a no-op.
  }
}
