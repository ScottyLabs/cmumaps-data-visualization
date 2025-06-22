# Script that combines other json-to-database scripts to populate entire database
# python floorplans/deserializer/database_population.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt

import requests  # type: ignore
from building import create_buildings
from floor import create_floors
from room import create_rooms
from alias import create_aliases
from node import create_nodes
from edge import create_edges


def drop_all_tables():
    table_names = ["Building", "Floor", "Room", "Alias", "Node", "Edge", "Poi"]
    server_url = os.getenv("SERVER_URL")
    response = requests.delete(
        f"{server_url}/api/drop-tables",
        json={"tableNames": table_names},
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


if __name__ == "__main__":
    drop_all_tables()

    # Populate all tables
    create_buildings()
    print("created buildings")
    create_floors()
    print("created floors")
    create_rooms()
    print("created rooms")
    create_aliases()
    print("created aliases")
    create_nodes()
    print("created nodes")
    create_edges()
    print("created edges")
