
# Smart City Route Finder
# File: city_data.py
# Purpose: Store city locations and road distances.

# All locations in our smart city
LOCATIONS = [
    "University",
    "Hospital",
    "Airport",
    "Bus Stand",
    "Mall",
    "Station",
    "Park"
]

# Roads between locations and their distances in kilometres.
# Each road connects two locations.
# The roads work in both directions.

ROADS = [
    ("University", "Hospital", 4),
    ("University", "Bus Stand", 2),
    ("Hospital", "Mall", 1),
    ("Hospital", "Airport", 5),
    ("Bus Stand", "Mall", 3),
    ("Bus Stand", "Park", 7),
    ("Mall", "Station", 2),
    ("Airport", "Station", 4),
    ("Park", "Station", 3)
]


def create_graph():
    """Create a graph from the locations and roads."""

    graph = {}

    # Create an empty neighbour list for every location.
    for location in LOCATIONS:
        graph[location] = []

    # Add every road in both directions.
    for start, end, distance in ROADS:
        graph[start].append((end, distance))
        graph[end].append((start, distance))

    return graph


# Create the city graph for other files to use.
CITY_GRAPH = create_graph()


# Run this file directly to check the city data.
if __name__ == "__main__":
    print("SMART CITY ROUTE FINDER")
    print("-" * 30)

    print("\nAvailable Locations:")
    for location in LOCATIONS:
        print("-", location)

    print("\nConnected Roads:")
    for start, end, distance in ROADS:
        print(f"{start} <-> {end}: {distance} km")

    print("\nCity graph created successfully!")
