use axum::response::IntoResponse;
use serde::de::DeserializeOwned;
use serde::{Serialize, Deserialize};
use std::cmp::Ordering;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use std::sync::Arc;



#[derive(Debug, PartialOrd, PartialEq, Serialize)]
pub struct CmpF32(pub f32);

impl Eq for CmpF32 {}

impl Ord for CmpF32 {
    fn cmp(&self, other: &Self) -> Ordering {
	if let Some(ordering) = self.partial_cmp(other) {
	    ordering
	} else {
	    // Choose what to do with NaNs, for example:
	    Ordering::Less
	}
    }
}

impl CmpF32 {
    pub fn to_f32(&self) -> f32 {
        match &self {
            CmpF32(n) => -(*n)
        }
    }
}

#[derive(Deserialize, Debug, Clone, Hash, PartialEq, PartialOrd, Eq, Ord, Serialize)]
pub struct ToFloorInfo{ 
    pub toFloor: String, 
    // _type: String, // This underscore will cause issues ???
}

#[derive(Deserialize, Debug, Clone, PartialEq, PartialOrd, Serialize)]
pub struct Edge {
    pub dist: f32,
    pub toFloorInfo: Option<ToFloorInfo>,
}

#[derive(Deserialize, Debug, Clone, Hash, PartialEq, PartialOrd, Eq, Ord, Serialize)]
pub struct Floor {
    pub buildingCode: String,
    pub level: String,
}

#[derive(Deserialize, Debug, Clone, PartialEq, PartialOrd, Serialize)]
pub struct Coordinate {
    pub latitude: f32,
    pub longitude: f32,
}

impl Coordinate {
    pub fn dist(&self, other: &Coordinate) -> f32 {
        let lat_m_ratio = 111318.8450631976;
        let lon_m_ratio = 84719.3945182816;

        let (lat1, lon1) = (&self.latitude, &self.longitude);
        let (lat2, lon2) = (other.latitude, other.longitude);
        let dist1 = (lat1 - lat2) * lat_m_ratio;
        let dist2 = (lon1 - lon2) * lon_m_ratio;

        (dist1.powf(2.0) + dist2.powf(2.0)).sqrt()
    }
}

#[derive(Deserialize, Debug, Clone, PartialEq, Serialize)]
pub struct Node { // dropped the pos field
    pub neighbors: HashMap<String, Edge>, // Hashmap, really?
    pub roomId: String,
    pub floor: Floor,
    pub coordinate: Coordinate,
    pub id: String,
}

#[derive(Serialize, Hash, PartialEq, Eq)]
pub struct GraphPath {
    pub path: Vec<String>,
    pub add_cost: String,
}

type NodeGraphPath = Vec<Node>;

#[derive(Serialize)]
pub struct Route { 
    pub path: GraphPath,
    pub distance: CmpF32,
}

#[derive(Serialize, Debug, Clone)]
pub struct NodesRoute {
    pub path: NodeGraphPath,
    pub distance: f32
}

pub type Graph = HashMap<String, Node>;

#[derive(Deserialize, Clone)]
pub struct UserPosition { pub userPosition: Coordinate }

#[derive(Deserialize, Clone)]
pub struct PlaceOnMap { pub waypoint: Coordinate }

#[derive(Deserialize, Clone)]
pub struct Room {
    /**
     * Unique ID (UUID)
     */
    pub id: String,

    // Others that we do not need :)
  }

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct Building {
    /**
     * The code of the building (e.g. 'WEH')
     */
    pub code: String,
  
    /**
     * The name of the buliding (e.g. 'Wean Hall')
     */
    name: String,
  
    /**
     * A list of floor levels in the building.
     */
    pub floors: Vec<String>,

    /**
     * A list of all the nodes that link from outside to the building
     */
    pub entrances: Vec<String>,
  
    /**
     * The name of the floor displayed by default for this building.
     */
    defaultFloor: String,
  
    /**
     * The ordinal of the default floor (the ordinal of the Cut is 0)
     */
    defaultOrdinal: Option<i16>,
  
    /**
     * The position of the label for the building's code.
     */
    labelPosition: Coordinate,
  
    /**
     * The shapes that the building consists of.
     */
    shapes: Vec<Vec<Coordinate>>,
  
    /**
     * The zone in which the building is considered to be the primary building.
     */
    hitbox: Option<Vec<Coordinate>>,
  }

pub type Buildings = HashMap<String, Building>;

#[derive(Deserialize, Clone, Debug, Serialize)]
#[serde(untagged)]
pub enum Waypoint {
    Room(String), // Room(roomId), serialized as a UUID
    Building(String), // Building (buildingId), serialized as a short code (e.g. 'WEH')
    Coordinate(Coordinate), // Coordinate {lat lon}, serialized as 'lat,lon'
}
// implement Waypoint::from_string for Waypoint.  if the string is a UUID, it is a Room, if it is a building code (short < 5), it is a Building, if it is a coordinate, it is a Coordinate
impl Waypoint {
    pub fn from_string(s: &String) -> Result<Waypoint, String> {
        if s.len() == 36 && !s.contains(',') { // UUID length and no curly braces characterizing a coordinate
            Ok(Waypoint::Room(s.to_string()))
        } else if s.len() < 5 { // Building code length
            Ok(Waypoint::Building(s.to_string()))
        } else {
            let parts: Vec<&str> = s.split(',').collect();
            if parts.len() == 2 {
                let lat = parts[0].parse::<f32>().map_err(|_| "Invalid latitude".to_string())?;
                let lon = parts[1].parse::<f32>().map_err(|_| "Invalid longitude".to_string())?;
                Ok(Waypoint::Coordinate(Coordinate { latitude: lat, longitude: lon }))
            } else {
                Err("Invalid Waypoint format".to_string())
            }
        }
    }
}

#[derive(Deserialize, Clone, Debug, Serialize)]
pub struct Waypoints {
    pub waypoints: Vec<Waypoint>
}

#[derive(Debug, Clone, Serialize)]
pub enum Action {
    Left,
    Right,
    Straight,
    Door,
    Stairs, // Floor change of some kind, including elevators, escalators, and fire poles
}

#[derive(Debug, Clone, Serialize)]
pub struct Instruction {
    pub action: Action,
    pub distance: f32, // Distance in meters
    pub node_id: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct PreciseRoute {
    pub path: NodesRoute,
    pub instructions: Vec<Instruction>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchParams {
    pub start: String,
    pub end: String
}
    
#[derive(Debug, Clone)]
pub struct AppState {
    pub graph: Arc<Graph>,
    pub buildings: Arc<Buildings>,
}

pub fn parse_json<P: AsRef<Path>, T>(path: P) -> T
where 
    T: DeserializeOwned,
{
    let json_file = File::open(path)
        .expect("Failed to open documents file");
    let json_reader = BufReader::new(json_file);
    let docs = serde_json::from_reader(json_reader)
        .expect("Failed to parse documents file");
    docs
}

#[derive(Debug)]
pub struct PathError {
    pub message: String,
    pub status: axum::http::StatusCode,
}
impl IntoResponse for PathError {
    fn into_response(self) -> axum::response::Response {
        let body = self.message.into_bytes();
        (self.status, body).into_response()
    }
}