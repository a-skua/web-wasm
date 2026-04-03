package main

import (
	"github.com/a-skua/web-wasm/examples/go/internal/web/document/document"
	"github.com/a-skua/web-wasm/examples/go/internal/web/std/console"
	"github.com/a-skua/web-wasm/examples/go/internal/web/std/fetch"
)

func main() {
	console.Time("fetch")
	req := fetch.Request{
		URL:     "/hello.json",
		Method:  fetch.MethodGet,
		Headers: []fetch.Header{},
	}
	result := fetch.Fetch(req)
	console.TimeEnd("fetch")

	if ok := result.OK(); ok != nil {
		console.Log(ok.Text())

		el := document.QuerySelector("#app")
		if appEl := el.Some(); appEl != nil {
			text := document.CreateTextNode(ok.Text())
			appEl.AppendText(text)
		}
	} else if err := result.Err(); err != nil {
		console.Error("fetch failed")
	}
}
