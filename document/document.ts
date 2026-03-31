import { Element, Text } from "./types.ts";

export { Element, Text };

export function querySelector(selector: string): Element | undefined {
  const el = globalThis.document.querySelector(selector);
  return el ? new Element(el) : undefined;
}

export function createTextNode(data: string): Text {
  const text = globalThis.document.createTextNode(data);
  return new Text(text);
}
