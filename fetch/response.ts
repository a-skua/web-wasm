/**
 * Host implementation of `web:fetch/response`.
 *
 * @module
 */

import {
  ConstructorError,
  fromReadableStream,
  toBody,
  tryAsyncResult,
  tryResult,
} from "./_convert.ts";
import { Headers, type HeadersInit, toHeadersInit } from "./headers.ts";
import type { BodyInit, Error, ResponseType, Result } from "./types.ts";

/** `ResponseInit`. */
export interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
}

function toResponseInit(
  init: ResponseInit | undefined,
): globalThis.ResponseInit | undefined {
  if (init === undefined) {
    return undefined;
  }

  const out: globalThis.ResponseInit = {};
  if (init.status !== undefined) out.status = init.status;
  if (init.statusText !== undefined) out.statusText = init.statusText;
  if (init.headers !== undefined) out.headers = toHeadersInit(init.headers);
  return out;
}

/** Set while Response.from() constructs a wrapper. */
let wrapping: globalThis.Response | undefined;

/** `Response`. */
export class Response {
  #response: globalThis.Response;

  /** @throws {ConstructorError} */
  constructor(body: BodyInit | undefined, init: ResponseInit | undefined) {
    if (wrapping !== undefined) {
      this.#response = wrapping;
      return;
    }
    try {
      this.#response = new globalThis.Response(
        toBody(body),
        toResponseInit(init),
      );
    } catch (e) {
      throw new ConstructorError(e);
    }
  }

  /** Wraps an existing JavaScript `Response`. */
  static from(response: globalThis.Response): Response {
    wrapping = response;
    try {
      return new Response(undefined, undefined);
    } finally {
      wrapping = undefined;
    }
  }

  static error(): Response {
    return Response.from(globalThis.Response.error());
  }

  static redirect(
    url: string,
    status: number | undefined,
  ): Result<Response, Error> {
    return tryResult(() =>
      Response.from(globalThis.Response.redirect(url, status))
    );
  }

  body(): AsyncIterable<number> | undefined {
    const body = this.#response.body;
    return body ? fromReadableStream(body) : undefined;
  }

  bodyUsed(): boolean {
    return this.#response.bodyUsed;
  }

  headers(): Headers {
    return Headers.from(this.#response.headers);
  }

  ok(): boolean {
    return this.#response.ok;
  }

  redirected(): boolean {
    return this.#response.redirected;
  }

  status(): number {
    return this.#response.status;
  }

  statusText(): string {
    return this.#response.statusText;
  }

  type(): ResponseType {
    return this.#response.type;
  }

  url(): string {
    return this.#response.url;
  }

  bytes(): Promise<Result<Uint8Array, Error>> {
    return tryAsyncResult(async () =>
      new Uint8Array(await this.#response.arrayBuffer())
    );
  }

  text(): Promise<Result<string, Error>> {
    return tryAsyncResult(() => this.#response.text());
  }

  clone(): Result<Response, Error> {
    return tryResult(() => Response.from(this.#response.clone()));
  }
}
