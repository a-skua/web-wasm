import type { Duration } from "./types.ts";

/** Monotonic clock mark in nanoseconds. */
export type Mark = bigint;

export function now(): Mark {
  return BigInt(Math.round(performance.now() * 1_000_000));
}

export function getResolution(): Duration {
  return BigInt(1_000_000);
}

export function waitUntil(when: Mark): Promise<void> {
  return waitFor(when - now());
}

export function waitFor(howLong: Duration): Promise<void> {
  if (howLong <= 0n) {
    return Promise.resolve();
  }
  const ms = Number(howLong) / 1_000_000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
