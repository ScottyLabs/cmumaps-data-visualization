# Script to populate EventTracks table using data from the file cmumaps-data/spring-carnival/carnival_events.json
# python scripts/json-to-database-carnival/event_tracks.py

from prisma import Prisma  # type: ignore
import asyncio
import json
from tracks import drop_specified_tables

prisma = Prisma()


def get_tags(tracks):
    tags = set()
    for track in tracks:
        # self-mapping tracks
        if track in [
            "CMU Tradition",
            "Food",
            "Awards/Celebration",
            "Exhibit/Tour",
            "Health/Wellness",
            "Alumni",
        ]:
            tags.add(track)
        # track maps to a different tag
        elif track == "Reunion":
            tags.add("Alumni")
        elif track == "Buggy":
            tags.add("CMU Tradition")
        elif track == "Scotch'n'Soda" or track == "Entertainment":
            tags.add("Performance")
        elif track == "Libraries" or track == "Open House/Reception":
            tags.add("Exhibit/Tour")
        elif track == "Athletics":
            tags.add("Health/Wellness")
    return list(tags)


async def create_event_tracks():
    await prisma.connect()

    eventTracks_data = []
    eventId_set = set()

    with open("cmumaps-data/spring-carnival/carnival_events.json", "r") as file:
        data = json.load(file)
    # Iterate through all events
    for event in data:
        eventId = data[event]["eventId"]
        tracks = data[event]["tracks"]
        if eventId not in eventId_set:
            # only create eventTracks if that eventId has not been seen before,
            # therefore making each eventTrack pair unique
            tags = get_tags(tracks)  # tags is tracks (mapping)
            for track in tags:
                # Create EventTrack entry
                eventTrack = {
                    "eventId": eventId,
                    "trackName": track,
                }
                eventId_set.add(eventId)
                eventTracks_data.append(eventTrack)

    # Create all Events entries
    async with prisma.tx() as tx:
        await tx.eventtrack.create_many(data=eventTracks_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_specified_tables(["EventTrack"]))
    asyncio.run(create_event_tracks())
    print("Created table: EventTrack")
