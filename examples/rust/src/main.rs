wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

fn main() {
    web::std::console::time("greeting");
    web::std::console::log("Hello, Wasm Component with Rust!");
    web::std::console::time_end("greeting");
}
