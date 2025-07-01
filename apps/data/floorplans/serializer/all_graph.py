# Script to create a serialized version of all-graph.json from the database.
# python floorplans/serializer/all_graph.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt

import requests
import json
    
def all_graph_serializer():
    """
    Fetches floor data from the server and saves it to the all-graph-serialized.json
    """
    
    server_url = os.getenv("SERVER_URL")
    
    headers = {"Authorization": f"Bearer {get_clerk_jwt()}",
               "X-Socket-Id": "my-serializer-script" }
    
    nodes_response = requests.get(
        f"{server_url}/api/nodes", 
        headers=headers)

    nodes_response.raise_for_status() # debugging
    nodes = nodes_response.json()
    
    all_nodes_data = {}
    
    for node in nodes:
        node_info = nodes[node]
        
        node_dict = {}
        node_dict['id'] = node_info['id']
        node_dict['pos'] = {
            'x': 0,
            'y': 0
        }
        node_dict['coordinate'] = {
            'latitude': node_info['latitude'],
            'longitude': node_info['longitude']
        }
        if node_info['roomId']:
            node_dict['roomId'] = node_info['roomId']
        else: node_dict['roomId'] = ""
        if node_info['buildingCode']:
            node_dict['floor'] = {
                'buildingCode': node_info['buildingCode'],
                'level': node_info['floorLevel']
            }
        if node_info['neighbors']:
            neighbors = node_info['neighbors']
            neighbors_dict = {}
            for neighbor in neighbors:
                neighbors_dict[neighbor] = {
                    'dist': 0
                }
            node_dict['neighbors'] = neighbors_dict
            
        all_nodes_data[node] = node_dict
            
    # Save file           
    with open("cmumaps-data/floorplans/all-graph-serialized.json", 'w') as f:
        json.dump(all_nodes_data, f, indent=4)
    
    return
    
if __name__ == "__main__":
    all_graph_serializer()