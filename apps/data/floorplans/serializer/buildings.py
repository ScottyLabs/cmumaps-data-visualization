# Script to create a serialized version of buildings.json from the database.
# python floorplans/serializer/buildings.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt

import requests
import json
    
def buildings_serializer():
    """
    Fetches floor data from the server and saves it to the buildings_serialized.json
    """
    
    server_url = os.getenv("SERVER_URL")
    
    headers = {"Authorization": f"Bearer {get_clerk_jwt()}"}
    
    buildings_response = requests.get(
        f"{server_url}/api/buildings", 
        headers=headers)

    buildings_response.raise_for_status() # debugging
    buildings = buildings_response.json()
    
    all_buildings_data = {}
    
    for building in buildings:
        building_info = buildings[building]
        
        # populate building_dict
        building_dict = {}
        building_dict["name"] = building_info['name']
        building_dict["floors"] = building_info['floors']
        building_dict["labelPosition"] = {
            "latitude": building_info['labelLatitude'],
            "longitude": building_info['labelLongitude']
        }
        building_dict["shapes"] = building_info['shape']
        building_dict["hitbox"] = building_info['hitbox']
        building_dict["code"] = building_info['code']
        if building_info['osmId']:
            building_dict["osmId"] = building_info['osmId']
        if building_info['defaultFloor']:
            building_dict["defaultFloor"] = building_info['defaultFloor']
        if building_info['defaultOrdinal']: 
            building_dict["defaultOrdinal"] = building_info['defaultOrdinal']
        
        all_buildings_data[building] = building_dict
    
    # Save file           
    with open("cmumaps-data/floorplans/buildings_serialized.json", 'w') as f:
        json.dump(all_buildings_data, f, indent=4)
    
    return
    
if __name__ == "__main__":
    buildings_serializer()