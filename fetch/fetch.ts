/**
 * Host implementation of `web:fetch/fetch`.
 *
 * @module
 */

import { tryAsyncResult } from "./_convert.ts";
import {
  type RequestInfo,
  type RequestInit,
  toRequestInfo,
  toRequestInit,
} from "./request.ts";
import { Response } from "./response.ts";
import type { Error, Result } from "./types.ts";

/** `fetch(resource, options)`. */
export function fetch(
  resource: RequestInfo,
  options: RequestInit | undefined,
): Promise<Result<Response, Error>> {
  return tryAsyncResult(async () =>
    Response.from(
      await globalThis.fetch(
        toRequestInfo(resource),
        toRequestInit(options),
      ),
    )
  );
}
