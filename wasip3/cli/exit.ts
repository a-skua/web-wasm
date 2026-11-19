import type { Result } from "./types.ts";

export function exit(status: Result<void, void>): void {
  if (status.tag === "err") {
    throw new globalThis.Error("exit with error");
  }
}

export function exitWithCode(statusCode: number): void {
  if (statusCode !== 0) {
    throw new globalThis.Error(`exit with code ${statusCode}`);
  }
}
