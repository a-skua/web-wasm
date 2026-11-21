wit_bindgen::generate!({
    world: "app",
    path: "wit",
    generate_all,
});

use web::fetch::fetch::fetch;
use web::fetch::headers::{Headers, HeadersInit};
use web::fetch::request::{Request, RequestInfo, RequestInit};
use web::fetch::response::{Response, ResponseInit};
use web::fetch::types::{BodyInit, Error, Method};
use web::std::console;

const URL: &str = "/hello.json";

fn main() {
    // Component Model async imports must be awaited inside wit-bindgen's runtime.
    wit_bindgen::block_on(async {
        if let Err(e) = run().await {
            console::error(&format!("{e:?}"));
        }
    });
}

async fn run() -> Result<(), Error> {
    simple_get().await?;
    get_with_request().await?;
    construct_response().await?;
    invalid_header();
    Ok(())
}

/// `fetch("/hello.json")` and read the body with `response.text()`.
async fn simple_get() -> Result<(), Error> {
    console::time("fetch");
    let response = fetch(RequestInfo::Url(URL.to_string()), None).await?;
    console::time_end("fetch");

    log_response(&response);
    console::log(&response.text().await?);
    Ok(())
}

/// `fetch(new Request(url, { headers }))` and read the body as a stream.
async fn get_with_request() -> Result<(), Error> {
    let headers = Headers::new(Some(HeadersInit::Entries(vec![(
        "accept".to_string(),
        "application/json".to_string(),
    )])))?;
    headers.append("x-example", "web-wasm")?;

    let request = Request::new(
        RequestInfo::Url(URL.to_string()),
        Some(RequestInit {
            method: Some(Method::Get),
            headers: Some(HeadersInit::Headers(headers)),
            ..request_init()
        }),
    )?;
    console::log(&format!("{:?} {}", request.method(), request.url()));
    for (name, value) in request.headers().entries() {
        console::log(&format!("> {name}: {value}"));
    }

    let response = fetch(RequestInfo::Request(request), None).await?;
    log_response(&response);

    let Some(body) = response.body() else {
        console::warn("no body");
        return Ok(());
    };
    let bytes = body.collect().await;
    console::log(&format!(
        "read {} bytes from stream: {}",
        bytes.len(),
        String::from_utf8_lossy(&bytes)
    ));
    Ok(())
}

/// `new Response(stream, { status: 201 })` with a body streamed from the guest.
async fn construct_response() -> Result<(), Error> {
    let (mut tx, rx) = wit_stream::new::<u8>();
    wit_bindgen::spawn_local(async move {
        for chunk in ["Hello, ", "stream ", "body!"] {
            tx.write_all(chunk.as_bytes().to_vec()).await;
        }
    });

    let response = Response::new(
        Some(BodyInit::Stream(rx)),
        Some(ResponseInit {
            status: Some(201),
            status_text: None,
            headers: None,
        }),
    )?;
    log_response(&response);
    console::log(&response.text().await?);
    Ok(())
}

/// `new Headers([["bad name", "x"]])` throws a `TypeError`.
fn invalid_header() {
    let init = HeadersInit::Entries(vec![("bad name".to_string(), "x".to_string())]);
    match Headers::new(Some(init)) {
        Ok(_) => console::error("unexpectedly succeeded"),
        Err(e) => console::log(&format!("expected error: {e:?}")),
    }
}

fn log_response(response: &Response) {
    console::log(&format!(
        "{} {} ok={} type={:?}",
        response.status(),
        response.status_text(),
        response.ok(),
        response.type_(),
    ));
    for (name, value) in response.headers().entries() {
        console::log(&format!("< {name}: {value}"));
    }
}

/// `RequestInit` with every member unset.
fn request_init() -> RequestInit {
    RequestInit {
        method: None,
        headers: None,
        body: None,
        referrer: None,
        referrer_policy: None,
        mode: None,
        credentials: None,
        cache: None,
        redirect: None,
        integrity: None,
        keepalive: None,
        signal: None,
        duplex: None,
        priority: None,
    }
}
