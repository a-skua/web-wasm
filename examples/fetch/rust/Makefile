SRC := $(shell find src -name "*.rs")
TARGET = wasm32-wasip2
OUT_DIR = target/$(TARGET)/release
PACKAGE_NAME := $(shell cargo metadata --format-version=1 --no-deps | jq -r '.packages[0].name')
DENO_DIR := $(shell deno info --json | jq -r .denoDir)
PORT ?= 8000

.PHONY: run
run: main.ts build
	deno run -E=JCO_DEBUG -R=. -N=0.0.0.0:$(PORT),localhost:$(PORT) \
		--location=http://localhost:$(PORT) $<

.PHONY: build
build: dist/$(PACKAGE_NAME).js

# jco loads a Node-API addon (oxc-minify), which needs --allow-ffi on Deno.
dist/$(PACKAGE_NAME).js: $(OUT_DIR)/$(PACKAGE_NAME).wasm
	deno run -E -R=.,$(DENO_DIR) -W=dist --allow-ffi=$(DENO_DIR) \
		npm:@bytecodealliance/jco transpile \
		--async-mode jspi --async-exports "wasi:cli/run@0.2.6#run" \
		--no-nodejs-compat --no-wasi-shim \
		-o $(dir $@) $<

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
