# python floorplans/serializer/main.py <Optional file_to_serialize> <Optional floor_code>
import sys
from placements import placements_serializer
from buildings import buildings_serializer
from floorplans import floorplans_serializer
from all_graph import all_graph_serializer

# Create buildings.json using Building and Floor table
# Create all-graph.json using Edge and Node table
# Create floorplans.json using Alias and Room table
# Create placements.json using Floor table

if __name__ == "__main__":
    if len(sys.argv) < 2: # serialize all
        placements_serializer()
        print("serialized placements.json into placements-serialized.json!")
        buildings_serializer()
        print("serialized buildings.json into buildings-serialized.json!")
        floorplans_serializer()
        print("serialized floorplans.json into floorplans-serialized.json!")
        all_graph_serializer()
        print("serialized all-graph.json into all-graph-serialized.json!")
    
    file_to_serialize = str(sys.argv[1])
    
    if len(sys.argv) > 2:
        if file_to_serialize != 'floorplans':
            print("Usage: python floorplans/serializer/main.py floorplans GH-1")
            sys.exit(1)
        # python floorplans/serializer/main.py <floorplans> <GH-1>
        floor_code = str(sys.argv[2])
        print(f"Serializing ONLY floor {floor_code}")
        floorplans_serializer(floor_code)
    
    elif file_to_serialize == 'placements':
        print("serialized placements.json into placements-serialized.json!")

    elif file_to_serialize == 'buildings':
        print("serialized buildings.json into buildings-serialized.json!")
    
    elif file_to_serialize == 'floorplans':
        floorplans_serializer()
        print("serialized floorplans.json into floorplans-serialized.json!")
    
    elif file_to_serialize == 'all-graph':
        all_graph_serializer()
        print("serialized all-graph.json into all-graph-serialized.json!")