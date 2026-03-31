wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

use web::std::console;
use web::document::document;

fn main() {
    console::log("Hello, World!");

    let el = document::query_selector("#app").expect("element not found");
    let text = document::create_text_node("Hello, World!");
    el.append_text(&text);
}
