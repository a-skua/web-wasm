# `web:fetch`

[Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API) as
[WebAssembly Component Model](https://component-model.bytecodealliance.org/)
interfaces.

The definitions follow the Web API (`fetch()`, `Headers`, `Request`, `Response`)
and use Component Model async (`async func`, `stream<u8>`, `future`) introduced
with WASI 0.3. There are no dependencies on `wasi:*` packages.

## Interfaces

| Interface            | Web API                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `web:fetch/types`    | Shared types (`RequestInit` enums, `BodyInit`, exceptions)           |
| `web:fetch/headers`  | [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers)      |
| `web:fetch/request`  | [`Request`](https://developer.mozilla.org/docs/Web/API/Request)      |
| `web:fetch/response` | [`Response`](https://developer.mozilla.org/docs/Web/API/Response)    |
| `web:fetch/fetch`    | [`fetch()`](https://developer.mozilla.org/docs/Web/API/Window/fetch) |

## Usage

```wit
package example:app;

world app {
    import web:fetch/fetch@0.3.2;
}
```

```wit
// web:fetch/fetch
fetch: async func(%resource: request-info, options: option<request-init>) -> result<response, error>;
```

### Fetching with `wkg`

The package is published to `ghcr.io/a-skua/web/fetch`. Add the `web` namespace
to your `wkg` config (`~/.config/wasm-pkg/config.toml`):

```toml
[namespace_registries]
web = { registry = "ghcr.io", metadata = { preferredProtocol = "oci", "oci" = { registry = "ghcr.io", namespacePrefix = "a-skua/" } } }
```

```sh
wkg get web:fetch@0.3.2
```

## Mapping to the Web API

| Web API                                   | WIT                                                                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `Promise<T>`                              | `async func` returning `result<T, error>`                                                          |
| `ReadableStream<Uint8Array>`              | `stream<u8>`                                                                                       |
| `AbortSignal`                             | `future` (the request is aborted when it resolves)                                                 |
| `null`                                    | `option<T>` (`none`)                                                                               |
| `""` of `destination` / `referrerPolicy`  | `none` of `option<T>`                                                                              |
| Properties (`request.url`, ...)           | Methods (`url: func() -> string`)                                                                  |
| `TypeError`, `RangeError`, `DOMException` | `error` variant (`type-error`, `range-error`, `abort-error`, `timeout-error`, `not-allowed-error`) |
| `method` string                           | `method` variant (`other(string)` for non-standard methods)                                        |
| `[name, value]` header pair               | `tuple<string, string>`                                                                            |

## Not supported

- `Blob`, `FormData`, `URLSearchParams` as `BodyInit`
- `json()`, `blob()`, `formData()` (no corresponding WIT types)
- `arrayBuffer()` (use `bytes()`; same WIT type)
- `Response.json()`
- `Headers.forEach()` (use `entries()`)
- `RequestInit`: `attributionReporting`, `browsingTopics`, `privateToken`,
  `targetAddressSpace`

## Build

```sh
wkg wit build
```
