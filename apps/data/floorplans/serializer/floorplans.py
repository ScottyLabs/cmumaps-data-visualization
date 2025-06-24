# Script to create a serialized version of floorplans.json from the database.
# python floorplans/serializer/floorplans.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt

import requests
import json

def floorplans_serializer(floor_code: str = None):
    """
    Fetches floor data from the server and saves it to the floorplans_serialized.json
    Optionally, if a floor code in the format of 'GHC-3' is provided,
    updates that floor in floorplans.json directly.
    """
    
    server_url = os.getenv("SERVER_URL")

    headers = {"Authorization": f"Bearer {get_clerk_jwt()}",
               "X-Socket-Id": "my-serializer-script" }
    
    # Update specific floor in floorplans_serializer.json
    if floor_code:
        file_to_update = "cmumaps-data/floorplans/floorplans-serialized.json"
        roomIds_response = requests.get(
            f"{server_url}/api/rooms/by-floor/{floor_code}", 
            headers=headers
        )
        roomIds_response.raise_for_status()
        roomIds = roomIds_response.json()
        
        with open(file_to_update, "r") as f:
            floorplans_data = json.load(f)
        for roomId in roomIds:
            room_to_update = requests.get(
                f"{server_url}/api/rooms/{roomId}", 
                headers=headers
            )
            room_to_update.raise_for_status() # debug
            
            room_info = room_to_update.json()[roomId]
            building_code = room_info['buildingCode']
            floor_level = room_info['floorLevel']
            new_room_dict = {
                "name": room_info['name'],
                "labelPosition": {
                    "latitude": room_info['labelLatitude'],
                    "longitude": room_info['labelLongitude']
                },
                "type": room_info['type'],
                "id": room_info['id'],
                "floor": {
                    "buildingCode": building_code,
                    "level": floor_level
                },
                "coordinates": room_info['polygon'],
                "aliases": room_info['aliases']
            }
            # Update room
            floorplans_data.setdefault(building_code, {}).setdefault(str(floor_level), {})[roomId] = new_room_dict
        with open(file_to_update, "w") as f:
            json.dump(floorplans_data, f, indent=2)
    
    else: # Update all
        floorplans_dict = {}
        rooms_response = requests.get(
            f"{server_url}/api/rooms", 
            headers=headers)
        rooms_response.raise_for_status() # debugging
        rooms = rooms_response.json()
        for room in rooms:
            room_info = rooms[room]
            building_code = room_info['buildingCode']
            floor_level = room_info['floorLevel']
            room_dict = {
                "name": room_info['name'],
                "labelPosition": {
                    "latitude": room_info['labelLatitude'],
                    "longitude": room_info['labelLongitude']
                },
                "type": room_info['type'],
                "id": room_info['id'],
                "floor": {
                    "buildingCode": building_code,
                    "level": floor_level
                },
                "coordinates": room_info['polygon'],
                "aliases": room_info['aliases']
            }
            if building_code not in floorplans_dict:
                floorplans_dict[building_code] = {}
            if floor_level not in floorplans_dict[building_code]:
                floorplans_dict[building_code][floor_level] = {}
            floorplans_dict[building_code][floor_level][room] = room_dict
            
        # Create serialized json file and save
        with open("cmumaps-data/floorplans/floorplans-serialized.json", 'w') as f:
            json.dump(floorplans_dict, f, indent=4)
    
    return

if __name__ == "__main__":
    floorplans_serializer(floor_code = None)