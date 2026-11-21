WORLD := app

# jco loads a Node-API addon (oxc-minify), which needs --allow-ffi on Deno.
DENO_DIR := $(shell deno info --json | jq -r .denoDir)

.PHONY: serve
serve: build
	deno run -NR=. jsr:@std/http/file-server

.PHONY: run
run: main.ts build
	deno run -E=JCO_DEBUG -R=. $<

.PHONY: build
build: dist/example.js

dist/%.js: %.wasm
	deno run -E -R=.,$(DENO_DIR) -W=dist --allow-ffi=$(DENO_DIR) \
		npm:@bytecodealliance/jco transpile \
		--async-mode jspi --no-nodejs-compat --no-wasi-shim \
		-o $(dir $@) $<

example.wasm: main.go internal
	tinygo build -target=wasip2 -wit-package wit -wit-world $(WORLD) -o $@ ./$<

internal: wit/deps
	go tool wit-bindgen-go generate --world $(WORLD) --out $@ wit

wit/deps: wit/*.wit wkg.toml
	wkg wit fetch

clean:
	rm -rf example.wasm dist
