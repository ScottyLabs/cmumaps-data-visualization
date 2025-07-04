use crate::types::{Node, NodesRoute, Action, Instruction, PreciseRoute};


fn calculate_angle(first: &Node, second: &Node, third: &Node) -> f32 {
    // This function would contain logic to calculate the angle between three nodes
    // For now, we will return a placeholder value
    let lat_diff_1 = (second.coordinate.latitude - first.coordinate.latitude) * 111318.8450631976; // Convert latitude difference to meters
    let lon_diff_1 = (second.coordinate.longitude - first.coordinate.longitude) * 84719.3945182816; // Convert longitude difference to meters
    let lat_diff_2 = (third.coordinate.latitude - second.coordinate.latitude) * 111318.8450631976; // Convert latitude difference to meters
    let lon_diff_2 = (third.coordinate.longitude - second.coordinate.longitude) * 84719.3945182816; // Convert longitude difference to meters

    let angle = (lat_diff_1 * lon_diff_2 - lon_diff_1 * lat_diff_2).atan2(lat_diff_1 * lat_diff_2 + lon_diff_1 * lon_diff_2).to_degrees();
    angle
}

pub fn get_precise_route(route: NodesRoute) -> PreciseRoute {
    // This function would contain logic to convert a Route into a PreciseRoute
    // This first version will just take windows of three nodes and check if the angle between them differs from 180 degrees by at least 30 degrees
    let path = &route.path;
    let instructions: Vec<Instruction> = path.windows(3).enumerate().filter_map(|(i, window)| {
        if window.len() < 3 {
            return None; // Not enough nodes to form an instruction
        }
        
        let first = &window[0];
        let second = &window[1];
        let third = &window[2];

        // Calculate the angle between the three nodes
        let angle = calculate_angle(first, second, third);
        
        if angle.abs() >= 30.0 && angle.abs() <= 150.0 { // Assuming we want to filter out straight lines
            let direction = if angle < 0.0 { Action::Left } else { Action::Right };
            Some(Instruction {
                action: direction, // Placeholder for actual action determination logic
                distance: 42.0,
                node_id: second.id.clone(),
            })
        } else {
            None
        }
    }).collect();

    // Plot the route using cgrustplot
   

    // Extract latitudes and longitudes from the path
    let lats: Vec<f64> = path.iter().map(|n| n.coordinate.latitude as f64).collect();
    let lons: Vec<f64> = path.iter().map(|n| n.coordinate.longitude as f64).collect();

    // Normalize coordinates to fit in a grid
    let min_lat = lats.iter().cloned().fold(f64::INFINITY, f64::min);
    let max_lat = lats.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    let min_lon = lons.iter().cloned().fold(f64::INFINITY, f64::min);
    let max_lon = lons.iter().cloned().fold(f64::NEG_INFINITY, f64::max);

    let grid_height = 20;
    let grid_width = 40;
    let mut grid = vec![vec![0.0; grid_width]; grid_height];

    for (lat, lon) in lats.iter().zip(lons.iter()) {
        let y = ((lat - min_lat) / (max_lat - min_lat + 1e-9) * (grid_height as f64 - 1.0)).round() as usize;
        let x = ((lon - min_lon) / (max_lon - min_lon + 1e-9) * (grid_width as f64 - 1.0)).round() as usize;
        if y < grid_height && x < grid_width {
            grid[y][x] = 1.0;
        }
    }

    PreciseRoute {
        path: route.clone(),
        instructions,
    }
}