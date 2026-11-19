import { writeLines } from "./_output.ts";
import type { ErrorCode, Result } from "./types.ts";

export function writeViaStream(
  data: AsyncIterable<number>,
): Promise<Result<void, ErrorCode>> {
  return writeLines(data, (line) => console.log(line));
}
