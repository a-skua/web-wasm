import type { Duration } from "./types.ts";

export interface Instant {
  seconds: bigint;
  nanoseconds: number;
}

export function now(): Instant {
  const ms = Date.now();
  const seconds = BigInt(Math.floor(ms / 1000));
  const nanoseconds = (ms % 1000) * 1_000_000;
  return { seconds, nanoseconds };
}

export function getResolution(): Duration {
  return BigInt(1_000_000);
}
