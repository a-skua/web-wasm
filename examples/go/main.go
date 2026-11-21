package main

import (
	"github.com/a-skua/web-wasm/examples/go/internal/web/document/document"
	"github.com/a-skua/web-wasm/examples/go/internal/web/std/console"
)

func main() {
	message := "Hello, World!"
	console.Log(message)

	el := document.QuerySelector("#app")
	if some := el.Some(); some != nil {
		text := document.CreateTextNode(message)
		some.AppendText(text)
	}
}
