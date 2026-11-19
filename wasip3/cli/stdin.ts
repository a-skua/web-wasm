import type { ErrorCode, Result } from "./types.ts";

export function readViaStream(): [
  AsyncIterable<number>,
  Promise<Result<void, ErrorCode>>,
] {
  // stdin is always empty in the browser.
  async function* empty(): AsyncGenerator<number> {}
  return [empty(), Promise.resolve({ tag: "ok", val: undefined })];
}
