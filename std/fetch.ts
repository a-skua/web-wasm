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

  constructor(status: number, statusText: string, headers: Header[], body: Uint8Array) {
    this.#status = status;
    this.#statusText = statusText;
    this.#headers = headers;
    this.#body = body;
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

export async function fetch(request: Request): Promise<FetchResult> {
  const method = METHOD_MAP[request.method] ?? "GET";

  try {
    const headers = new Headers();
    for (const h of request.headers) {
      headers.set(h.name, h.value);
    }

    const resp = await globalThis.fetch(request.url, {
      method,
      headers,
      body: request.body ? (request.body.buffer as ArrayBuffer) : null,
    });

    const respHeaders: Header[] = [];
    resp.headers.forEach((value, name) => {
      respHeaders.push({ name, value });
    });

    const body = new Uint8Array(await resp.arrayBuffer());

    return {
      tag: "ok",
      val: new Response(resp.status, resp.statusText, respHeaders, body),
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { tag: "err", val: { tag: "network-error", val: message } };
  }
}
