use std::{collections::HashMap};

pub mod types;
pub mod turns;
pub mod graph;
use axum::{
    debug_handler, extract::{Query, State}, Json
};

#[debug_handler]
pub async fn path(Query(_params): Query<types::SearchParams>, state: State<types::AppState>) -> Result<Json<HashMap<String, types::PreciseRoute>>, types::PathError> {
    let start_time = std::time::Instant::now();
    println!("{:?} {:?}", _params.start, _params.end);

    let start_waypoint = types::Waypoint::from_string(&_params.start).or_else(|_| {
        return Err(types::PathError {
            message: "Invalid start waypoint format".to_string(),
            status: axum::http::StatusCode::BAD_REQUEST,
        });
    })?;
    let end_waypoint = types::Waypoint::from_string(&_params.end).or_else(|_| {
        return Err(types::PathError {
            message: "Invalid end waypoint format".to_string(),
            status: axum::http::StatusCode::BAD_REQUEST,
        });
    })?;

    // parse query into start and end nodes
    let start_nodes = graph::waypoint_to_nodes(start_waypoint, &state.graph, &state.buildings);
    let end_nodes = graph::waypoint_to_nodes(end_waypoint, &state.graph, &state.buildings);

    // validate start and end nodes
    if start_nodes.is_empty() || end_nodes.is_empty() {
        let msg = if start_nodes.is_empty() && end_nodes.is_empty() {
            "Could not match start or end waypoint to any nodes"
        } else if start_nodes.is_empty() {
            "Could not match start waypoint to any nodes"
        } else {
            "Could not match end waypoint to any nodes"
        };
        return Err(types::PathError {
            message: msg.to_string(),
            status: axum::http::StatusCode::BAD_REQUEST,
        });
    }

    println!("Pre-computation over at: {:?}", start_time.elapsed());

    // get the best path + instructions
    let route = graph::get_route(&start_nodes, &end_nodes, &state.graph, 1.0);
    if let Ok(route) = route {
        println!("Route found in: {:?}", start_time.elapsed());
        // combine + return as Json
        let routes_response = HashMap::from([
            (
                "Fastest".to_string(),
                route
            )
        ]);
        println!("Path computation over at: {:?}", start_time.elapsed());
        return Ok(Json(routes_response))
    } else {
        return Err(types::PathError {
            message: "No path found".to_string(),
            status: axum::http::StatusCode::NOT_FOUND,
        });
    }
}