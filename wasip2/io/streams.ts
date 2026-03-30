import type { Error } from "./error.ts";
import { Pollable } from "./poll.ts";

export type StreamError =
  | { tag: "last-operation-failed"; val: Error }
  | { tag: "closed" };

export class InputStream {
  #closed = false;

  read(_len: bigint): Uint8Array {
    if (this.#closed) {
      throw { tag: "closed" } satisfies StreamError;
    }
    return new Uint8Array(0);
  }

  subscribe(): Pollable {
    return new Pollable();
  }
}

export class OutputStream {
  #closed = false;
  #handler: (bytes: Uint8Array) => void;

  constructor(handler: (bytes: Uint8Array) => void) {
    this.#handler = handler;
  }

  checkWrite(): bigint {
    if (this.#closed) {
      throw { tag: "closed" } satisfies StreamError;
    }
    return BigInt(Number.MAX_SAFE_INTEGER);
  }

  write(contents: Uint8Array): void {
    if (this.#closed) {
      throw { tag: "closed" } satisfies StreamError;
    }
    this.#handler(contents);
  }

  blockingWriteAndFlush(contents: Uint8Array): void {
    this.write(contents);
  }

  blockingFlush(): void {
    if (this.#closed) {
      throw { tag: "closed" } satisfies StreamError;
    }
  }

  subscribe(): Pollable {
    return new Pollable();
  }
}
