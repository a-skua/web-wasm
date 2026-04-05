export function insecureSeed(): [bigint, bigint] {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const view = new DataView(bytes.buffer);
  return [view.getBigUint64(0), view.getBigUint64(8)];
}
