export type Result<T, E> = { tag: "ok"; val: T } | { tag: "err"; val: E };

export function exit(status: Result<void, void>): void {
  if (status.tag === "err") {
    throw new globalThis.Error("exit with error");
  }
}
