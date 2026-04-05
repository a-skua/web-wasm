export class Pollable {
  #ready: boolean;

  constructor(ready = true) {
    this.#ready = ready;
  }

  ready(): boolean {
    return this.#ready;
  }

  block(): void {
    // In a synchronous browser environment, this is a no-op.
  }
}

export function poll(pollables: Pollable[]): Uint32Array {
  const ready: number[] = [];
  for (let i = 0; i < pollables.length; i++) {
    if (pollables[i].ready()) {
      ready.push(i);
    }
  }
  return new Uint32Array(ready);
}
