use priority_queue::PriorityQueue;
use types::CmpF32;

use std::collections::{HashMap, HashSet};
use std::str::FromStr;

use crate::turns::get_precise_route;
use crate::types;

/// Converts a waypoint (Room, Building, or Coordinate as PlaceOnMap or UserPosition)
pub fn waypoint_to_nodes(waypoint: types::Waypoint, graph: &types::Graph, buildings: &HashMap<String, types::Building>) -> Vec<String> {
    let mut nodes = vec![];
    match waypoint {
        types::Waypoint::Room(room_id) => {
            // Find all nodes assigned to this room
            for value in graph.values() {
                if value.roomId == room_id {
                    nodes.push(value.id.clone())
                }
            }
        },
        types::Waypoint::Building(building_code) => {
            // Just get the precomputed entrances from buildings.json
            nodes = buildings[&building_code].entrances.clone()
        }, 
        types::Waypoint::Coordinate(placement) => {
            // Search over all nodes for one that is closest to the coordinate
            let coord = placement.clone();
            let mut best_dist = None;
            let mut best_node = None;
            for node in graph.values(){ // Improve this with an R* tree
                let dist = node.coordinate.dist(&coord);
                match best_dist {
                    None => {
                        best_dist = Some(dist);
                        best_node = Some(node.id.clone());
                    },
                    Some(cmp_dist) => if CmpF32(dist) < CmpF32(cmp_dist){
                        best_dist = Some(dist);
                        best_node = Some(node.id.clone());
                    }
                }
            }
            nodes = vec![best_node.expect("Graph should not be empty")]
        }
    }
    nodes
    
}

/// Finds best (shortest iff outside_cost_mul == 1) path between two sets of nodes
/// in the graph, picking  penalizing distance outside by a multiplier (outside_cost_mul)
/// Returns the penalized cost and, inside the GraphPath, the penalty amount
/// penalized cost - penalty amount = true cost
pub fn find_path(start_nodes: &Vec<String>, end_nodes: &Vec<String>, graph: &types::Graph, outside_cost_mul: f32)->Option<types::Route>{
    /// Init work list and empty explored set
    let mut pq = PriorityQueue::new();
    let mut explored_set = HashSet::new();

    // Iter over start nodes, returning on first (not least) path found
    for node_id in start_nodes {

        // Init pq with current start node
        let node = graph.get(node_id).unwrap();
        pq.push(
            types::GraphPath{path: vec![node.id.clone()], add_cost: String::from_str("0.0").unwrap()},
         types::CmpF32(0.0)
        );

        // Loop until pq is empty or first path is found, always explore lower-cost paths first
        while let Some((graph_path, length)) = pq.pop() {
            // Extract the node path and the outside penalty (add_cost)
            let cur_path = graph_path.path;
            let cur_add_cost = graph_path.add_cost;
            // number of nodes in path 
            let path_len = cur_path.len();
            assert!(path_len > 0);
            
            // Extracting neighbors from the most recently added node to the path
            let last_node_id = cur_path[path_len-1].clone();
            let last_node = match graph.get(&last_node_id) {
                None => continue,
                Some(node) => node,
            };

            if !explored_set.contains(&last_node_id) {
                explored_set.insert(last_node_id);
            }
            else {
                continue
            }

            // Check if the popped off node is in the goal set
            for node in end_nodes.clone() {
                let last_node_id = cur_path[path_len-1].clone();
                if node == last_node_id {
                    return Some(types::Route {
                        distance: length,
                        path: types::GraphPath{
                            path: cur_path,
                            add_cost: cur_add_cost
                        },
                    });
                }
            }

            // Add neighbors
            let neighbors = &last_node.neighbors;
            for (id, edge) in neighbors.iter() {
                let mut path_copy = cur_path.to_vec();
                path_copy.push(id.to_string());
                let types::CmpF32(float_len) = length;
                let mut outside_add = 0.0;
                let step_dist = {
                    if edge.dist < 0.0 {
                        25.0
                    }
                    else if last_node.floor.buildingCode == "outside" && graph[id].floor.buildingCode == "outside" {
                        // Calculate and track penalty cost, must be mult to penalize distance not nodes.
                        let ret = edge.dist * outside_cost_mul;
                        outside_add += edge.dist * (outside_cost_mul-1.0);
                        ret
                    }
                    else {
                        edge.dist
                    }
                };
                let new_length = -float_len + step_dist; 
                let cur_add_f32 = cur_add_cost.parse::<f32>().unwrap();
                pq.push(types::GraphPath{
                    path: path_copy,
                    add_cost: (cur_add_f32 + outside_add).to_string()
                }, types::CmpF32(-new_length));
            }
        }
    }
    None
} 

pub fn get_route(start_nodes: &Vec<String>, end_nodes: &Vec<String>, graph: &types::Graph, outside_cost_mul: f32) -> Result<types::PreciseRoute, types::PathError> {
    // run find_path
    let abc = find_path(&start_nodes, &end_nodes, &graph, outside_cost_mul)
        .ok_or_else(|| types::PathError {
            message: "No path found".to_string(),
            status: axum::http::StatusCode::NOT_FOUND,
        })?;

    let nodes_route = types::NodesRoute {
        path: abc.path.path.iter().map(|node| (&graph[node]).clone()).collect(),
        distance: abc.distance.to_f32() - abc.path.add_cost.parse::<f32>().unwrap()
    };
    Ok(get_precise_route(nodes_route))
}