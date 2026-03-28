.PHONY: build clean deps

TARGET = wasm32-wasip2
OUT_DIR = target/$(TARGET)/release

build: deps
	cargo build --target $(TARGET) --release

deps:
	wkg wit fetch

clean:
	cargo clean
