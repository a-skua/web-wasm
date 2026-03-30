export function getRandomBytes(len: bigint): Uint8Array {
  const bytes = new Uint8Array(Number(len));
  crypto.getRandomValues(bytes);
  return bytes;
}

export function getRandomU64(): bigint {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const view = new DataView(bytes.buffer);
  return view.getBigUint64(0);
}
