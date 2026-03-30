export interface Datetime {
  seconds: bigint;
  nanoseconds: number;
}

export function now(): Datetime {
  const ms = Date.now();
  const seconds = BigInt(Math.floor(ms / 1000));
  const nanoseconds = (ms % 1000) * 1_000_000;
  return { seconds, nanoseconds };
}

export function resolution(): Datetime {
  return { seconds: BigInt(0), nanoseconds: 1_000_000 };
}
