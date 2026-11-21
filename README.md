# @askua/web

Web API definitions as
[WebAssembly Component Model](https://component-model.bytecodealliance.org/)
interfaces.

This project provides WIT (WebAssembly Interface Type) definitions for web
standard APIs. A reference host implementation is published as a Deno package on
[JSR](https://jsr.io/@askua/web).

## Packages

### `spec/` — WIT Definitions

WIT interface definitions for web platform APIs.

| Package                            | Interfaces                                         |
| ---------------------------------- | -------------------------------------------------- |
| `web:std@0.3.2`                    | `console`                                          |
| `web:document@0.3.2`               | `types`, `document`                                |
| [`web:fetch@0.3.2`](./spec/fetch/) | `types`, `headers`, `request`, `response`, `fetch` |

### `std/`, `document/`, `fetch/`, `wasip2/`, `wasip3/` — Deno Host Implementation ([JSR](https://jsr.io/@askua/web))

A reference implementation in TypeScript for Deno. Provides `web:*` interface
implementations and WASI v0.2.0 / v0.3.0 stubs required by Wasm Components that
target `wasi:cli/command`.

| Module                            | Interface                           |
| --------------------------------- | ----------------------------------- |
| `./std/console`                   | `web:std/console@0.3.2`             |
| `./document/types`                | `web:document/types@0.3.2`          |
| `./document/document`             | `web:document/document@0.3.2`       |
| `./fetch/headers`                 | `web:fetch/headers@0.3.2`           |
| `./fetch/request`                 | `web:fetch/request@0.3.2`           |
| `./fetch/response`                | `web:fetch/response@0.3.2`          |
| `./fetch/fetch`                   | `web:fetch/fetch@0.3.2`             |
| `./wasip2/cli/environment`        | `wasi:cli/environment@0.2.0`        |
| `./wasip2/cli/exit`               | `wasi:cli/exit@0.2.0`               |
| `./wasip2/cli/stdin`              | `wasi:cli/stdin@0.2.0`              |
| `./wasip2/cli/stdout`             | `wasi:cli/stdout@0.2.0`             |
| `./wasip2/cli/stderr`             | `wasi:cli/stderr@0.2.0`             |
| `./wasip2/cli/terminal-input`     | `wasi:cli/terminal-input@0.2.0`     |
| `./wasip2/cli/terminal-output`    | `wasi:cli/terminal-output@0.2.0`    |
| `./wasip2/cli/terminal-stdin`     | `wasi:cli/terminal-stdin@0.2.0`     |
| `./wasip2/cli/terminal-stdout`    | `wasi:cli/terminal-stdout@0.2.0`    |
| `./wasip2/cli/terminal-stderr`    | `wasi:cli/terminal-stderr@0.2.0`    |
| `./wasip2/clocks/monotonic-clock` | `wasi:clocks/monotonic-clock@0.2.0` |
| `./wasip2/clocks/wall-clock`      | `wasi:clocks/wall-clock@0.2.0`      |
| `./wasip2/filesystem/preopens`    | `wasi:filesystem/preopens@0.2.0`    |
| `./wasip2/filesystem/types`       | `wasi:filesystem/types@0.2.0`       |
| `./wasip2/io/error`               | `wasi:io/error@0.2.0`               |
| `./wasip2/io/poll`                | `wasi:io/poll@0.2.0`                |
| `./wasip2/io/streams`             | `wasi:io/streams@0.2.0`             |
| `./wasip2/random/random`          | `wasi:random/random@0.2.0`          |
| `./wasip3/cli/environment`        | `wasi:cli/environment@0.3.0`        |
| `./wasip3/cli/exit`               | `wasi:cli/exit@0.3.0`               |
| `./wasip3/cli/types`              | `wasi:cli/types@0.3.0`              |
| `./wasip3/cli/stdin`              | `wasi:cli/stdin@0.3.0`              |
| `./wasip3/cli/stdout`             | `wasi:cli/stdout@0.3.0`             |
| `./wasip3/cli/stderr`             | `wasi:cli/stderr@0.3.0`             |
| `./wasip3/cli/terminal-input`     | `wasi:cli/terminal-input@0.3.0`     |
| `./wasip3/cli/terminal-output`    | `wasi:cli/terminal-output@0.3.0`    |
| `./wasip3/cli/terminal-stdin`     | `wasi:cli/terminal-stdin@0.3.0`     |
| `./wasip3/cli/terminal-stdout`    | `wasi:cli/terminal-stdout@0.3.0`    |
| `./wasip3/cli/terminal-stderr`    | `wasi:cli/terminal-stderr@0.3.0`    |
| `./wasip3/clocks/types`           | `wasi:clocks/types@0.3.0`           |
| `./wasip3/clocks/monotonic-clock` | `wasi:clocks/monotonic-clock@0.3.0` |
| `./wasip3/clocks/system-clock`    | `wasi:clocks/system-clock@0.3.0`    |
| `./wasip3/filesystem/preopens`    | `wasi:filesystem/preopens@0.3.0`    |
| `./wasip3/filesystem/types`       | `wasi:filesystem/types@0.3.0`       |
| `./wasip3/random/random`          | `wasi:random/random@0.3.0`          |
| `./wasip3/random/insecure`        | `wasi:random/insecure@0.3.0`        |
| `./wasip3/random/insecure-seed`   | `wasi:random/insecure-seed@0.3.0`   |

## Examples

Since browsers do not yet support the WebAssembly Component Model natively, the
examples use [JCO](https://github.com/nicolo-ribaudo/jco) to transpile Wasm
Components into JavaScript modules, then run them on [Deno](https://deno.com/).

- [Go](./examples/go/) — TinyGo + wit-bindgen-go
- [Rust](./examples/rust/) — Rust + wit-bindgen
- [Rust (fetch)](./examples/fetch/rust/) — `web:fetch` with Component Model
  async (`async func`, `stream<u8>`)

## Install

```
deno add jsr:@askua/web
```

## License

[MIT](./LICENSE)
