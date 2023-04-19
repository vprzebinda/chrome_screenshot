use axum::{
    body::Bytes,
    extract::Path,
    http::header,
    response::IntoResponse,
    routing::get,
    routing::post,
    Router,
};
use std::collections::hash_map::DefaultHasher;
use std::fs::File;
use std::hash::{Hash, Hasher};
use std::io::prelude::*;

static SCREENSHOT_DIRECTORY : &str = "/md/screenshots";

fn calculate_hash<T: Hash>(t: &T) -> u64 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    s.finish()
}

async fn upload(body: Bytes) -> String {
    let hashname = calculate_hash(&body);
    let mut f = File::create(format!("{}/{}.png", SCREENSHOT_DIRECTORY, hashname)).unwrap();
    println!("hash {} {}", hashname, body.len());
    f.write(&body).unwrap();
    format!("{}", hashname)
}

async fn getimage(Path(key): Path<String>) -> impl IntoResponse {
    // Parse as int for security.
    println!("key {}", key);
    let int_key : u64 = key.parse().unwrap();
    println!("loading {} {}", key, int_key.to_string());
    let mut f = File::open(format!("{}/{}.png", SCREENSHOT_DIRECTORY, int_key.to_string())).unwrap();
    let mut buf = Vec::new();
    f.read_to_end(&mut buf).unwrap();
    ([(header::CONTENT_TYPE, "image/png")], buf)
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "" }))
        .route("/blank", get(|| async { "" }))
        .route("/screenshots/:key", get(getimage))
        .route("/upload", post(upload));

    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:4444".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
