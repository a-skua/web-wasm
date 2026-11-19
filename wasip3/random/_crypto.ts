// crypto.getRandomValues() accepts at most 65536 bytes per call.
const MAX_CHUNK = 65536;

export function randomBytes(len: bigint): Uint8Array {
  const bytes = new Uint8Array(Number(len));
  for (let offset = 0; offset < bytes.length; offset += MAX_CHUNK) {
    crypto.getRandomValues(bytes.subarray(offset, offset + MAX_CHUNK));
  }
  return bytes;
}

export function randomU64(): bigint {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return new DataView(bytes.buffer).getBigUint64(0);
}
