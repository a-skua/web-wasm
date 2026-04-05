package main

import (
	"go.bytecodealliance.org/cm"

	"github.com/a-skua/web-wasm/examples/go/internal/web/document/document"
	"github.com/a-skua/web-wasm/examples/go/internal/web/std/console"
	"github.com/a-skua/web-wasm/examples/go/internal/web/std/fetch"
)

func main() {
	console.Time("fetch")
	req := fetch.Request{
		URL:     "/hello.json",
		Method:  fetch.MethodGet,
		Headers: cm.ToList([]fetch.Header{}),
	}
	future := fetch.Fetch(req)
	_ = future // TODO: cm.Future methods not yet implemented
	console.TimeEnd("fetch")

	console.Log("Hello, World!")

	el := document.QuerySelector("#app")
	if some := el.Some(); some != nil {
		text := document.CreateTextNode("Hello, World!")
		some.AppendText(text)
	}
}
