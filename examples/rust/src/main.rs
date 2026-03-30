wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

use web::std::console;

fn main() {
    console::time("greeting");
    console::log("Hello, Wasm Component with Rust!");
    console::time_end("greeting");
}
