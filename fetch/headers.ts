/**
 * Host implementation of `web:fetch/headers`.
 *
 * @module
 */

import { ConstructorError, tryResult } from "./_convert.ts";
import type { Error, Result } from "./types.ts";

/** `[name, value]` pair. */
export type Header = [string, string];

/** `HeadersInit`. */
export type HeadersInit =
  | { tag: "headers"; val: Headers }
  | { tag: "entries"; val: Header[] };

/** Converts `headers-init` into a JavaScript `HeadersInit`. */
export function toHeadersInit(
  init: HeadersInit | undefined,
): globalThis.HeadersInit | undefined {
  switch (init?.tag) {
    case undefined:
      return undefined;
    case "headers":
      return init.val._headers();
    case "entries":
      return init.val;
  }
}

/** Set while Headers.from() constructs a wrapper. */
let wrapping: globalThis.Headers | undefined;

/** `Headers`. */
export class Headers {
  #headers: globalThis.Headers;

  /** @throws {ConstructorError} */
  constructor(init: HeadersInit | undefined) {
    if (wrapping !== undefined) {
      this.#headers = wrapping;
      return;
    }
    try {
      this.#headers = new globalThis.Headers(toHeadersInit(init));
    } catch (e) {
      throw new ConstructorError(e);
    }
  }

  /** Wraps an existing JavaScript `Headers` (shares the same object). */
  static from(headers: globalThis.Headers): Headers {
    wrapping = headers;
    try {
      return new Headers(undefined);
    } finally {
      wrapping = undefined;
    }
  }

  /** @internal */
  _headers(): globalThis.Headers {
    return this.#headers;
  }

  append(name: string, value: string): Result<void, Error> {
    return tryResult(() => this.#headers.append(name, value));
  }

  delete(name: string): Result<void, Error> {
    return tryResult(() => this.#headers.delete(name));
  }

  get(name: string): Result<string | undefined, Error> {
    return tryResult(() => this.#headers.get(name) ?? undefined);
  }

  getSetCookie(): string[] {
    return this.#headers.getSetCookie();
  }

  has(name: string): Result<boolean, Error> {
    return tryResult(() => this.#headers.has(name));
  }

  set(name: string, value: string): Result<void, Error> {
    return tryResult(() => this.#headers.set(name, value));
  }

  entries(): Header[] {
    return [...this.#headers.entries()];
  }

  keys(): string[] {
    return [...this.#headers.keys()];
  }

  values(): string[] {
    return [...this.#headers.values()];
  }
}
