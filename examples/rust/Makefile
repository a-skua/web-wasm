SRC := $(shell find src -name "*.rs")
TARGET = wasm32-wasip2
OUT_DIR = target/$(TARGET)/release
PACKAGE_NAME := $(shell cargo metadata --format-version=1 --no-deps | jq -r '.packages[0].name')

# jco loads a Node-API addon (oxc-minify), which needs --allow-ffi on Deno.
DENO_DIR := $(shell deno info --json | jq -r .denoDir)

.PHONY: serve
serve: build
	deno run -NR=. jsr:@std/http/file-server

.PHONY: run
run: main.ts build
	deno run -E=JCO_DEBUG -R=. $<

.PHONY: build
build: dist/$(PACKAGE_NAME).js

dist/$(PACKAGE_NAME).js: $(OUT_DIR)/$(PACKAGE_NAME).wasm
	deno run -E -R=.,$(DENO_DIR) -W=dist --allow-ffi=$(DENO_DIR) \
		npm:@bytecodealliance/jco transpile \
		--async-mode jspi --no-nodejs-compat --no-wasi-shim \
		-o $(dir $@) $<

$(OUT_DIR)/$(PACKAGE_NAME).wasm: $(SRC) wit/deps Cargo.toml
	cargo build --target $(TARGET) --release

.PHONY: update
update: wit/deps Cargo.lock

wit/deps: wit/*.wit wkg-config.toml
	wkg fetch --config wkg-config.toml

Cargo.lock: Cargo.toml
	cargo check

.PHONY: clean
clean:
	cargo clean
	rm -rf dist
