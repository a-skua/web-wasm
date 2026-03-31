export class Element {
  #element: globalThis.Element;

  constructor(element: globalThis.Element) {
    this.#element = element;
  }

  querySelector(selector: string): Element | undefined {
    const el = this.#element.querySelector(selector);
    return el ? new Element(el) : undefined;
  }

  append(child: Element): void {
    this.#element.append(child.#element);
  }

  appendText(child: Text): void {
    this.#element.append(child._node());
  }
}

export class Text {
  #text: globalThis.Text;

  constructor(text: globalThis.Text) {
    this.#text = text;
  }

  data(): string {
    return this.#text.data;
  }

  setData(value: string): void {
    this.#text.data = value;
  }

  /** @internal */
  _node(): globalThis.Text {
    return this.#text;
  }
}
