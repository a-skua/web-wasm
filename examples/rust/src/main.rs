wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

use web::document::document;
use web::std::console;

fn main() {
    let message = "Hello, World!";
    console::log(message);

    let el = document::query_selector("#app").expect("element not found");
    let text_node = document::create_text_node(message);
    el.append_text(&text_node);
}
