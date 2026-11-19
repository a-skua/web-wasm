import type { ErrorCode, Result } from "./types.ts";

/** A chunk of a `stream<u8>` as handed over by the host bindings. */
type ByteChunk = number | Uint8Array | ArrayLike<number>;

function toBytes(chunk: ByteChunk): Uint8Array {
  if (typeof chunk === "number") {
    return Uint8Array.of(chunk);
  }
  return chunk instanceof Uint8Array ? chunk : Uint8Array.from(chunk);
}

/**
 * Reads a `stream<u8>` to the end, decodes it as UTF-8 and calls `log` for
 * each line (without the trailing newline). A trailing partial line is
 * flushed when the stream ends.
 */
export async function writeLines(
  data: AsyncIterable<ByteChunk>,
  log: (line: string) => void,
): Promise<Result<void, ErrorCode>> {
  const decoder = new TextDecoder();
  let buffer = "";

  const flushLines = () => {
    let index: number;
    while ((index = buffer.indexOf("\n")) >= 0) {
      log(buffer.slice(0, index));
      buffer = buffer.slice(index + 1);
    }
  };

  try {
    for await (const chunk of data) {
      buffer += decoder.decode(toBytes(chunk), { stream: true });
      flushLines();
    }
    buffer += decoder.decode();
    flushLines();
    if (buffer.length > 0) {
      log(buffer);
    }
    return { tag: "ok", val: undefined };
  } catch {
    return { tag: "err", val: "io" };
  }
}
