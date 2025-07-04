use std::sync::Arc;

use axum::http::Method;
use path::graph;
use tower_http::cors::{Any, CorsLayer};

use axum::{
    routing::get,
    Router,
};

use dotenv::dotenv;

#[tokio::main]
async fn main() {
    // // specify the path to the documents from .env
    dotenv().ok();
    let data_path = std::env::var("DATA_PATH").expect("DATA_PATH must be set");

    let buildings_path = format!("{}/floorplans/buildings.json", data_path);
    let floorplans_path = format!("{}/floorplans/floorplans.json", data_path);

    let (index, documents) = search::build::build_search_index(
        buildings_path,
        floorplans_path,
    );

    let docs_path = format!("{}/documents.json", data_path);
    let index_path = format!("{}/search_index.json", data_path);

    let graph_path = format!("{}/floorplans/all-graph.json", data_path);
    let buildings_path = format!("{}/floorplans/buildings.json", data_path);

    let graph: path::types::Graph = path::types::parse_json(graph_path);
    let buildings: path::types::Buildings = path::types::parse_json(buildings_path);

    // add state
    let path_state: path::types::AppState = path::types::AppState {
        graph: Arc::new(graph),
        buildings: Arc::new(buildings)
    };

    let search_state: search::types::AppState = search::types::AppState {
        index: Arc::new(index),
        docs: Arc::new(documents),
    };

    // init cors middleware
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    println!("Loaded {} documents", search_state.docs.len());

    let path_routes = Router::new()
        .route("/path", get(path::path))
        .with_state(path_state);

    let search_routes = Router::new()
        .route("/search", get(search::search))
        .with_state(search_state);

    // build our application with a single route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .merge(path_routes)
        .merge(search_routes)
        .layer(cors);

    // run our app with hyper, listening globally on port FAST = 3278
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3278").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}