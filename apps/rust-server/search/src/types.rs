use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::{collections::HashMap};
use std::cmp::Ordering;


#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(untagged)]
pub enum Document {
    Room(RoomDocument), 
    Carnival(CarnivalDocument),
    Course(CourseDocument),
} 

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SearchParams { 
    pub query: String, 
    pub n: Option<usize>,
    pub pos: Option<Coordinate>,
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub docs: Arc<Documents>,
    pub index: Arc<SearchIndex>,
}

pub type SearchIndex = HashMap<String, Vec<(String, u16)>>;

pub type CourseDocuments = HashMap<String, CourseDocument>;

pub type CarnivalDocuments = HashMap<String, CarnivalDocument>;
pub type RoomDocuments = HashMap<String, RoomDocument>;

pub type Documents = HashMap<String, Document>;
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RoomDocument {
    pub id: String,
    pub name_with_space: String,
    pub full_name_with_space: String,
    pub label_position: Option<Coordinate>,
    #[serde(rename(deserialize = "type"), alias = "type")]
    pub _type: String, // serde treat as type
    pub alias: String,
    pub num_terms: u16,
}


#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CarnivalDocument {
    pub description: Option<String>,
    pub start_date_time: Option<String>,
    pub end_date_time: Option<String>,
    pub title: String,
    pub event_id: String,
    pub location_id: String,
    pub location_name: String,
    pub latitude: f32,
    pub longitude: f32,
    pub req: String,
    pub tracks: Vec<String>,
    pub tag: String,
    pub num_terms: u16
}


#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CourseDocument {
    #[serde(alias = "_id")]
    pub id: oid,
    #[serde(alias = "courseID")]
    pub course_id: String,
    pub desc: String,
    pub prereqs: Vec<String>,
    pub prereq_string: String,
    pub coreqs: Vec<String>,
    pub crosslisted: Vec<String>,
    pub name: String,
    pub units: String,
    pub department: String,
    pub num_terms: u16
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct oid {
    #[serde(rename = "$oid")]
    pub oid: String
}


#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Floor {
    #[serde(alias = "buildingCode")]
    pub building_code: String, 
    pub level: String
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Coordinate {
    pub latitude: f32,
    pub longitude: f32,
}

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

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Building {
    /**
     * The code of the building (e.g. 'WEH')
     */
    pub code: String,
  
    /**
     * The name of the buliding (e.g. 'Wean Hall')
     */
    pub name: String,

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
    pub default_floor: String,
  
    /**
     * The ordinal of the default floor (the ordinal of the Cut is 0)
     */
    pub default_ordinal: Option<i16>,

    /**
     * The position of the label for the building's code.
     */
    pub label_position: Coordinate,
  
    /**
     * The shapes that the building consists of.
     */
    pub shapes: Vec<Vec<Coordinate>>,

    /**
     * The zone in which the building is considered to be the primary building.
     */
    pub hitbox: Option<Vec<Coordinate>>,    
  }

pub type Buildings = HashMap<String, Building>;

#[derive(Deserialize, Clone)]
#[serde(untagged)]
pub enum Waypoint {
    Room(String), 
    Building(String),
    UserPosition(Coordinate),
    PlaceOnMap(Coordinate)
}

#[derive(Deserialize, Clone)]
pub struct Waypoints {
    pub waypoints: Vec<Waypoint>
}

pub type FloorPlans = HashMap<String, BuildingPlan>;
pub type BuildingPlan = HashMap<String, RoomPlan>;
pub type RoomPlan = HashMap<String, Room>;
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Room {
    pub name: String,
    #[serde(rename = "labelPosition")]
    pub label_position: Coordinate,
    #[serde(rename = "type")] // serde expect to read as "type"
    pub room_type: String,
    pub id: String,
    pub floor: Floor,
    // pub coordinates: Vec<Vec<Coordinate>>, // never need these :)
    pub aliases: Vec<String>,
}
