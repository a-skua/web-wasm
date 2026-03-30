SRC := $(shell find src -name "*.rs")
TARGET = wasm32-wasip2
OUT_DIR = target/$(TARGET)/release
PACKAGE_NAME := $(shell cargo metadata --format-version=1 --no-deps | jq -r '.packages[0].name')

.PHONY: serve
serve: build
	deno run -NR=. jsr:@std/http/file-server

.PHONY: run
run: main.ts build
	deno run -E=JCO_DEBUG -R=. $<

.PHONY: build
build: dist/$(PACKAGE_NAME).js

dist/$(PACKAGE_NAME).js: $(OUT_DIR)/$(PACKAGE_NAME).wasm
	deno run -A npm:@bytecodealliance/jco transpile --no-nodejs-compat --no-wasi-shim -o $(dir $@) $<

$(OUT_DIR)/$(PACKAGE_NAME).wasm: $(SRC) wit/deps Cargo.toml
	cargo build --target $(TARGET) --release

.PHONY: update
update: wit/deps Cargo.lock

wit/deps: wit/*.wit wkg.toml
	wkg wit fetch

Cargo.lock: Cargo.toml
	cargo check

.PHONY: clean
clean:
	cargo clean
	rm -rf dist
