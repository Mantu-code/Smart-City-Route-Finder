
# Smart City Route Finder
# File: dijkstra.py
# Purpose: Find the shortest route using Dijkstra's Algorithm.

from city_data import CITY_GRAPH
import heapq


def find_shortest_path(source, destination):
    """Return the shortest route and total distance."""

    # Check whether both locations exist.
    if source not in CITY_GRAPH or destination not in CITY_GRAPH:
        return None, float("inf")

    # Distance from the source to every location.
    distances = {location: float("inf") for location in CITY_GRAPH}
    distances[source] = 0

    # Store the previous location for route reconstruction.
    previous = {location: None for location in CITY_GRAPH}

    # Priority queue: (distance, location)
    priority_queue = [(0, source)]

    while priority_queue:
        current_distance, current_location = heapq.heappop(
            priority_queue
        )

        # Skip an outdated queue entry.
        if current_distance > distances[current_location]:
            continue

        # Stop when the destination is reached.
        if current_location == destination:
            break

        # Check every neighbouring location.
        for neighbour, road_distance in CITY_GRAPH[current_location]:
            new_distance = current_distance + road_distance

            # Update if we find a shorter route.
            if new_distance < distances[neighbour]:
                distances[neighbour] = new_distance
                previous[neighbour] = current_location

                heapq.heappush(
                    priority_queue,
                    (new_distance, neighbour)
                )

    # If no route exists, return no path.
    if distances[destination] == float("inf"):
        return None, float("inf")

    # Reconstruct the route by moving backwards.
    path = []
    current = destination

    while current is not None:
        path.append(current)
        current = previous[current]

    path.reverse()

    return path, distances[destination]


# Test the algorithm when this file is run directly.
if __name__ == "__main__":
    start = "University"
    end = "Station"

    route, distance = find_shortest_path(start, end)

    print("SMART CITY ROUTE FINDER")
    print("-" * 30)
    print("Starting Location:", start)
    print("Destination:", end)

    if route:
        print("Shortest Route:", " -> ".join(route))
        print("Total Distance:", distance, "km")
    else:
        print("No route found.")
