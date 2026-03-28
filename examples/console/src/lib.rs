wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

struct Component;

export!(Component);

impl Guest for Component {
    fn run() {
        web::std::console::log("Hello, World!");
    }
}
