wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

use web::std::console;
use web::document::document;

fn main() {
    console::time("greeting console");
    console::log("Hello, World!");
    console::time_end("greeting console");

    console::time("greeting dom");
    let el = document::query_selector("#app").expect("element not found");
    let text = document::create_text_node("Hello, World!");
    el.append_text(&text);
    console::time_end("greeting dom");
}
