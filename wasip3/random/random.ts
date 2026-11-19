import { randomBytes, randomU64 } from "./_crypto.ts";

export function getRandomBytes(maxLen: bigint): Uint8Array {
  return randomBytes(maxLen);
}

export function getRandomU64(): bigint {
  return randomU64();
}
