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
        roomIds_response = requests.get(
            f"{server_url}/api/rooms/by-floor/{floor_code}", 
            headers=headers
        )
        roomIds_response.raise_for_status()
        for roomId in roomIds_response.json():
            room_to_update = requests.get(
                f"{server_url}/api/rooms/{roomId}", 
                headers=headers
            )
            room_to_update.raise_for_status()
            # Update room (in progress)
    
    else:
        rooms_response = requests.get(
            f"{server_url}/api/rooms", 
            headers=headers)
        rooms_response.raise_for_status() # debugging
        rooms = rooms_response.json()
        # Create serializes json file (in progress)

if __name__ == "__main__":
    floorplans_serializer()