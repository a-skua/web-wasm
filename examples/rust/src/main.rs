wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

use web::document::document;
use web::std::console;
use web::std::fetch::{fetch, Method, Request};
use wstd::io;

#[wstd::main]
async fn main() -> io::Result<()> {
    console::time("fetch");
    let req = Request {
        url: "/hello.json".to_string(),
        method: Method::Get,
        headers: vec![],
        body: None,
    };
    let result = fetch(&req).await;
    console::time_end("fetch");

    match result {
        Ok(response) => {
            let text = response.text();
            console::log(&text);

            let el = document::query_selector("#app").expect("element not found");
            let text_node = document::create_text_node(&text);
            el.append_text(&text_node);
        }
        Err(_) => {
            console::error("fetch failed");
        }
    }

    Ok(())
}
