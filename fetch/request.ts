/**
 * Host implementation of `web:fetch/request`.
 *
 * @module
 */

import {
  ConstructorError,
  destinationFromString,
  fromReadableStream,
  methodFromString,
  methodToString,
  toBody,
  tryAsyncResult,
  tryResult,
} from "./_convert.ts";
import { Headers, type HeadersInit, toHeadersInit } from "./headers.ts";
import type {
  BodyInit,
  Error,
  Method,
  ReferrerPolicy,
  RequestCache,
  RequestCredentials,
  RequestDestination,
  RequestDuplex,
  RequestMode,
  RequestPriority,
  RequestRedirect,
  Result,
} from "./types.ts";

type Option<T> = { tag: "none" } | { tag: "some"; val: T };

/** `RequestInfo`. */
export type RequestInfo =
  | { tag: "url"; val: string }
  | { tag: "request"; val: Request };

/** `RequestInit`. */
export interface RequestInit {
  method?: Method;
  headers?: HeadersInit;
  body?: BodyInit;
  referrer?: string;
  /** `option<option<referrer-policy>>`; `some(none)` is `""`. */
  referrerPolicy?: Option<ReferrerPolicy | undefined>;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  integrity?: string;
  keepalive?: boolean;
  /** `AbortSignal`: the request is aborted when this resolves. */
  signal?: PromiseLike<void>;
  duplex?: RequestDuplex;
  priority?: RequestPriority;
}

/** `RequestInit` members not yet in the TypeScript DOM lib. */
interface JsRequestInit extends globalThis.RequestInit {
  duplex?: RequestDuplex;
  priority?: RequestPriority;
}

/** Converts `request-info` into a JavaScript `RequestInfo`. */
export function toRequestInfo(input: RequestInfo): globalThis.RequestInfo {
  return input.tag === "url" ? input.val : input.val._request();
}

/** Converts `request-init` into a JavaScript `RequestInit`. */
export function toRequestInit(
  init: RequestInit | undefined,
): JsRequestInit | undefined {
  if (init === undefined) {
    return undefined;
  }

  const out: JsRequestInit = {};
  if (init.method !== undefined) out.method = methodToString(init.method);
  if (init.headers !== undefined) out.headers = toHeadersInit(init.headers);
  if (init.body !== undefined) out.body = toBody(init.body);
  if (init.referrer !== undefined) out.referrer = init.referrer;
  if (init.referrerPolicy?.tag === "some") {
    out.referrerPolicy = init.referrerPolicy.val ?? "";
  }
  if (init.mode !== undefined) out.mode = init.mode;
  if (init.credentials !== undefined) out.credentials = init.credentials;
  if (init.cache !== undefined) out.cache = init.cache;
  if (init.redirect !== undefined) out.redirect = init.redirect;
  if (init.integrity !== undefined) out.integrity = init.integrity;
  if (init.keepalive !== undefined) out.keepalive = init.keepalive;
  if (init.signal !== undefined) {
    const controller = new AbortController();
    init.signal.then(() => controller.abort());
    out.signal = controller.signal;
  }
  if (init.duplex !== undefined) out.duplex = init.duplex;
  if (init.priority !== undefined) out.priority = init.priority;
  return out;
}

/** Members of `Request` not available in every runtime. */
interface JsRequest extends globalThis.Request {
  readonly duplex?: RequestDuplex;
  readonly isHistoryNavigation?: boolean;
  readonly isReloadNavigation?: boolean;
}

/** Set while Request.from() constructs a wrapper. */
let wrapping: JsRequest | undefined;

/** `Request`. */
export class Request {
  #request: JsRequest;

  /** @throws {ConstructorError} */
  constructor(input: RequestInfo, init: RequestInit | undefined) {
    if (wrapping !== undefined) {
      this.#request = wrapping;
      return;
    }
    try {
      this.#request = new globalThis.Request(
        toRequestInfo(input),
        toRequestInit(init),
      );
    } catch (e) {
      throw new ConstructorError(e);
    }
  }

  /** Wraps an existing JavaScript `Request`. */
  static from(request: globalThis.Request): Request {
    wrapping = request;
    try {
      return new Request(undefined as never, undefined);
    } finally {
      wrapping = undefined;
    }
  }

  /** @internal */
  _request(): globalThis.Request {
    return this.#request;
  }

  body(): AsyncIterable<number> | undefined {
    const body = this.#request.body;
    return body ? fromReadableStream(body) : undefined;
  }

  bodyUsed(): boolean {
    return this.#request.bodyUsed;
  }

  cache(): RequestCache {
    return this.#request.cache;
  }

  credentials(): RequestCredentials {
    return this.#request.credentials;
  }

  destination(): RequestDestination | undefined {
    return destinationFromString(this.#request.destination);
  }

  duplex(): RequestDuplex {
    return this.#request.duplex ?? "half";
  }

  headers(): Headers {
    return Headers.from(this.#request.headers);
  }

  integrity(): string {
    return this.#request.integrity;
  }

  isHistoryNavigation(): boolean {
    return this.#request.isHistoryNavigation ?? false;
  }

  isReloadNavigation(): boolean {
    return this.#request.isReloadNavigation ?? false;
  }

  keepalive(): boolean {
    return this.#request.keepalive;
  }

  method(): Method {
    return methodFromString(this.#request.method);
  }

  mode(): RequestMode {
    return this.#request.mode;
  }

  redirect(): RequestRedirect {
    return this.#request.redirect;
  }

  referrer(): string {
    return this.#request.referrer;
  }

  referrerPolicy(): ReferrerPolicy | undefined {
    return this.#request.referrerPolicy || undefined;
  }

  url(): string {
    return this.#request.url;
  }

  bytes(): Promise<Result<Uint8Array, Error>> {
    return tryAsyncResult(async () =>
      new Uint8Array(await this.#request.arrayBuffer())
    );
  }

  text(): Promise<Result<string, Error>> {
    return tryAsyncResult(() => this.#request.text());
  }

  clone(): Result<Request, Error> {
    return tryResult(() => Request.from(this.#request.clone()));
  }
}
