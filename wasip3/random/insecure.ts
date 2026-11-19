import { randomBytes, randomU64 } from "./_crypto.ts";

export function getInsecureRandomBytes(maxLen: bigint): Uint8Array {
  return randomBytes(maxLen);
}

export function getInsecureRandomU64(): bigint {
  return randomU64();
}
