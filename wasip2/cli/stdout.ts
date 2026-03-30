import { OutputStream } from "../io/streams.ts";

export function getStdout(): OutputStream {
  return new OutputStream((bytes) => {
    const text = new TextDecoder().decode(bytes);
    if (text.endsWith("\n")) {
      console.log(text.slice(0, -1));
    } else {
      console.log(text);
    }
  });
}
