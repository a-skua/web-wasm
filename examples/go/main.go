package main

import (
	"github.com/a-skua/web-wasm/examples/go/internal/web/document/document"
	"github.com/a-skua/web-wasm/examples/go/internal/web/std/console"
)

func main() {
	console.Log("Hello, World!")

	el := document.QuerySelector("#app")
	if some := el.Some(); some != nil {
		text := document.CreateTextNode("Hello, World!")
		some.AppendText(text)
	}
}
