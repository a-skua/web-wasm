// Serves this directory on the `--location` origin so that the component can
// `fetch("/hello.json")`, then runs the component.
import { serveDir } from "@std/http/file-server";

const server = Deno.serve(
  { port: Number(location.port), onListen() {} },
  (req) => serveDir(req, { quiet: true }),
);

try {
  const { run } = await import("./dist/example.js");
  await run.run();
} finally {
  await server.shutdown();
}
