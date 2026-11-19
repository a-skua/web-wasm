export type ErrorCode = "io" | "illegal-byte-sequence" | "pipe";

export type Result<T, E> = { tag: "ok"; val: T } | { tag: "err"; val: E };
