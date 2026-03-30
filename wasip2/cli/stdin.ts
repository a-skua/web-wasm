import { InputStream } from "../io/streams.ts";

export function getStdin(): InputStream {
  return new InputStream();
}
