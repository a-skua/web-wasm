import type {
  BodyInit,
  ByteChunk,
  Error,
  Method,
  RequestDestination,
  Result,
} from "./types.ts";

/** Converts a thrown JavaScript value into `web:fetch/types.error`. */
export function toError(e: unknown): Error {
  if (e instanceof DOMException) {
    switch (e.name) {
      case "AbortError":
        return { tag: "abort-error", val: e.message };
      case "TimeoutError":
        return { tag: "timeout-error", val: e.message };
      case "NotAllowedError":
        return { tag: "not-allowed-error", val: e.message };
      default:
        return { tag: "type-error", val: `${e.name}: ${e.message}` };
    }
  }
  if (e instanceof RangeError) {
    return { tag: "range-error", val: e.message };
  }
  if (e instanceof globalThis.Error) {
    return { tag: "type-error", val: e.message };
  }
  return { tag: "type-error", val: String(e) };
}

/** Runs `f` and converts a thrown exception into `err`. */
export function tryResult<T>(f: () => T): Result<T, Error> {
  try {
    return { tag: "ok", val: f() };
  } catch (e) {
    return { tag: "err", val: toError(e) };
  }
}

/** Awaits `f` and converts a rejection into `err`. */
export async function tryAsyncResult<T>(
  f: () => Promise<T>,
): Promise<Result<T, Error>> {
  try {
    return { tag: "ok", val: await f() };
  } catch (e) {
    return { tag: "err", val: toError(e) };
  }
}

/**
 * Error thrown from a fallible constructor.
 *
 * The host bindings take `payload` as the `err` value.
 */
export class ConstructorError {
  readonly payload: Error;

  constructor(e: unknown) {
    this.payload = toError(e);
  }
}

const METHODS = {
  GET: "get",
  HEAD: "head",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  CONNECT: "connect",
  OPTIONS: "options",
  TRACE: "trace",
  PATCH: "patch",
} as const satisfies Record<string, Exclude<Method["tag"], "other">>;

export function methodToString(method: Method): string {
  return method.tag === "other" ? method.val : method.tag.toUpperCase();
}

export function methodFromString(method: string): Method {
  if (Object.hasOwn(METHODS, method)) {
    return { tag: METHODS[method as keyof typeof METHODS] };
  }
  return { tag: "other", val: method };
}

const DESTINATIONS: ReadonlySet<string> = new Set([
  "audio",
  "audioworklet",
  "document",
  "embed",
  "fencedframe",
  "font",
  "frame",
  "iframe",
  "image",
  "json",
  "manifest",
  "object",
  "paintworklet",
  "report",
  "script",
  "serviceworker",
  "sharedworker",
  "speculationrules",
  "style",
  "text",
  "track",
  "video",
  "worker",
  "xslt",
]);

export function destinationFromString(
  destination: string,
): RequestDestination | undefined {
  if (destination === "") {
    return undefined;
  }
  if (DESTINATIONS.has(destination)) {
    return { tag: destination } as RequestDestination;
  }
  return { tag: "other", val: destination };
}

function toBytes(chunk: ByteChunk): Uint8Array<ArrayBuffer> {
  if (typeof chunk === "number") {
    return Uint8Array.of(chunk);
  }
  return Uint8Array.from(chunk);
}

/** Converts a `stream<u8>` from the guest into a `ReadableStream`. */
export function toReadableStream(
  data: AsyncIterable<ByteChunk>,
): ReadableStream<Uint8Array<ArrayBuffer>> {
  const iterator = data[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(toBytes(value));
      }
    },
    async cancel(reason) {
      await iterator.return?.(reason);
    },
  });
}

/** Converts a `ReadableStream` into a `stream<u8>` for the guest. */
export async function* fromReadableStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<number> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield* value;
    }
  } finally {
    reader.releaseLock();
  }
}

/** Converts `web:fetch/types.body-init` into a JavaScript `BodyInit`. */
export function toBody(body: BodyInit | undefined): globalThis.BodyInit | null {
  switch (body?.tag) {
    case undefined:
      return null;
    case "text":
      return body.val;
    case "bytes":
      return Uint8Array.from(body.val);
    case "stream":
      return toReadableStream(body.val);
  }
}
