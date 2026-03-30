import { OutputStream } from "../io/streams.ts";

export function getStderr(): OutputStream {
  return new OutputStream((bytes) => {
    const text = new TextDecoder().decode(bytes);
    if (text.endsWith("\n")) {
      console.error(text.slice(0, -1));
    } else {
      console.error(text);
    }
  });
}
