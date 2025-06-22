# Script to create a serialized version of placements.json from the database.
# python floorplans/serializer/placements.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt

import requests
import json
    
def placements_serializer():
    """
    Fetches floor data from the server and saves it to the placements_serialized.json
    """
    
    server_url = os.getenv("SERVER_URL")
    
    all_floors_data = {}
    headers = {"Authorization": f"Bearer {get_clerk_jwt()}"}
    
    buildings_response = requests.get(
        f"{server_url}/api/buildings", 
        headers=headers)

    buildings_response.raise_for_status() # debugging
    buildings = buildings_response.json()

    for building in buildings:
        if buildings[building]['floors']:
            building_code = buildings[building]['code']
            floor_levels = buildings[building]['floors']
            all_floors_data[building_code] = {}
            
            for floor_level in floor_levels:
                floor_code = f"{building_code}-{floor_level}"
                floor_results = requests.get(
                    f"{server_url}/api/floors/{floor_code}/floorinfo",
                    headers=headers
                )
                floor_info = floor_results.json()
                floor_dict = {
                    "center": {
                        "latitude": floor_info['centerLatitude'],
                        "longitude": floor_info['centerLongitude']
                    },
                    "scale": floor_info['scale'],
                    "angle": floor_info['angle'],
                    "pdfCenter": {
                        "x": floor_info['centerX'],
                        "y": floor_info['centerY']
                    }
                }
                
                all_floors_data[building_code][floor_level] = floor_dict
    
    # Save file           
    with open("cmumaps-data/floorplans/placements_serialized.json", 'w') as f:
        json.dump(all_floors_data, f, indent=4)

    return

if __name__ == "__main__":
    placements_serializer()