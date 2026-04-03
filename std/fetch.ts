import { Pollable } from "../wasip2/io/poll.ts";

interface Header {
  name: string;
  value: string;
}

interface Request {
  url: string;
  method: string;
  headers: Header[];
  body: Uint8Array | undefined;
}

type FetchError =
  | { tag: "network-error"; val: string }
  | { tag: "timeout" };

type FetchResult =
  | { tag: "ok"; val: Response }
  | { tag: "err"; val: FetchError };

const METHOD_MAP: Record<string, string> = {
  get: "GET",
  head: "HEAD",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
  patch: "PATCH",
  options: "OPTIONS",
};

export class Response {
  #status: number;
  #statusText: string;
  #headers: Header[];
  #body: Uint8Array;

  constructor(xhr: XMLHttpRequest) {
    this.#status = xhr.status;
    this.#statusText = xhr.statusText;
    this.#headers = xhr
      .getAllResponseHeaders()
      .trim()
      .split("\r\n")
      .filter((h) => h)
      .map((h) => {
        const idx = h.indexOf(": ");
        return { name: h.slice(0, idx), value: h.slice(idx + 2) };
      });
    this.#body = new Uint8Array(xhr.response as ArrayBuffer);
  }

  status(): number {
    return this.#status;
  }

  statusText(): string {
    return this.#statusText;
  }

  ok(): boolean {
    return this.#status >= 200 && this.#status < 300;
  }

  headers(): Header[] {
    return this.#headers;
  }

  text(): string {
    return new TextDecoder().decode(this.#body);
  }

  bytes(): Uint8Array {
    return this.#body;
  }
}

export class FutureResponse {
  #result: FetchResult;

  constructor(result: FetchResult) {
    this.#result = result;
  }

  subscribe(): Pollable {
    return new Pollable(true);
  }

  get(): FetchResult | undefined {
    return this.#result;
  }
}

export function fetch(request: Request): FutureResponse {
  const method = METHOD_MAP[request.method] ?? "GET";

  try {
    const xhr = new XMLHttpRequest();
    xhr.open(method, request.url, false);
    xhr.responseType = "arraybuffer";

    for (const h of request.headers) {
      xhr.setRequestHeader(h.name, h.value);
    }

    xhr.send(request.body ? (request.body.buffer as ArrayBuffer) : null);

    return new FutureResponse({ tag: "ok", val: new Response(xhr) });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new FutureResponse({
      tag: "err",
      val: { tag: "network-error", val: message },
    });
  }
}
