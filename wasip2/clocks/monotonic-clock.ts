import { Pollable } from "../io/poll.ts";

export function now(): bigint {
  return BigInt(Math.round(performance.now() * 1_000_000));
}

export function resolution(): bigint {
  return BigInt(1_000_000);
}

export function subscribeInstant(_when: bigint): Pollable {
  return new Pollable();
}

export function subscribeDuration(_when: bigint): Pollable {
  return new Pollable();
}
