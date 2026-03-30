package main

import (
	"github.com/a-skua/web-wasm/examples/go/internal/web/std/console"
)

func main() {
	console.Time("geeting")
	console.Log("Hello, Wasm Component with Go!")
	console.TimeEnd("geeting")
}
