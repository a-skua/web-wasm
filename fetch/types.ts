/**
 * Types of `web:fetch/types`.
 *
 * @module
 */

export type Result<T, E> = { tag: "ok"; val: T } | { tag: "err"; val: E };

/** Exceptions thrown (or Promises rejected) by the Fetch API. */
export type Error =
  | { tag: "type-error"; val: string }
  | { tag: "range-error"; val: string }
  | { tag: "abort-error"; val: string }
  | { tag: "timeout-error"; val: string }
  | { tag: "not-allowed-error"; val: string };

/** `Request.method`. */
export type Method =
  | { tag: "get" }
  | { tag: "head" }
  | { tag: "post" }
  | { tag: "put" }
  | { tag: "delete" }
  | { tag: "connect" }
  | { tag: "options" }
  | { tag: "trace" }
  | { tag: "patch" }
  | { tag: "other"; val: string };

export type RequestMode = "navigate" | "same-origin" | "no-cors" | "cors";

export type RequestCredentials = "omit" | "same-origin" | "include";

export type RequestCache =
  | "default"
  | "no-store"
  | "reload"
  | "no-cache"
  | "force-cache"
  | "only-if-cached";

export type RequestRedirect = "follow" | "error" | "manual";

export type RequestDuplex = "half";

export type RequestPriority = "high" | "low" | "auto";

/** `ReferrerPolicy` (except `""`). */
export type ReferrerPolicy =
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "same-origin"
  | "origin"
  | "strict-origin"
  | "origin-when-cross-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

/** `RequestDestination` (except `""`). */
export type RequestDestination =
  | { tag: "audio" }
  | { tag: "audioworklet" }
  | { tag: "document" }
  | { tag: "embed" }
  | { tag: "fencedframe" }
  | { tag: "font" }
  | { tag: "frame" }
  | { tag: "iframe" }
  | { tag: "image" }
  | { tag: "json" }
  | { tag: "manifest" }
  | { tag: "object" }
  | { tag: "paintworklet" }
  | { tag: "report" }
  | { tag: "script" }
  | { tag: "serviceworker" }
  | { tag: "sharedworker" }
  | { tag: "speculationrules" }
  | { tag: "style" }
  | { tag: "text" }
  | { tag: "track" }
  | { tag: "video" }
  | { tag: "worker" }
  | { tag: "xslt" }
  | { tag: "other"; val: string };

export type ResponseType =
  | "basic"
  | "cors"
  | "default"
  | "error"
  | "opaque"
  | "opaqueredirect";

/** A chunk of a `stream<u8>` as handed over by the host bindings. */
export type ByteChunk = number | Uint8Array | ArrayLike<number>;

/** `BodyInit`. */
export type BodyInit =
  | { tag: "text"; val: string }
  | { tag: "bytes"; val: Uint8Array }
  | { tag: "stream"; val: AsyncIterable<ByteChunk> };
