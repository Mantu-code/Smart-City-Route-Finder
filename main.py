
# Smart City Route Finder
# File: main.py
# Purpose: Start a local web server for the project.

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser
import json

from city_data import LOCATIONS, ROADS
from dijkstra import find_shortest_path


# Folder containing this Python file and the web files.
PROJECT_DIR = Path(__file__).resolve().parent

# Address and port for the local website.
HOST = "127.0.0.1"
PORT = 8000


class RouteFinderHandler(SimpleHTTPRequestHandler):
    """Handle website files and shortest-route requests."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_DIR), **kwargs)

    def do_GET(self):
        # Return city data when the browser requests /api/city.
        if self.path == "/api/city":
            data = {
                "locations": LOCATIONS,
                "roads": [
                    {
                        "start": start,
                        "end": end,
                        "distance": distance
                    }
                    for start, end, distance in ROADS
                ]
            }

            self.send_json(data)
            return

        # Calculate the shortest route.
        if self.path.startswith("/api/route?"):
            from urllib.parse import urlparse, parse_qs

            parsed_url = urlparse(self.path)
            parameters = parse_qs(parsed_url.query)

            source = parameters.get("source", [""])[0]
            destination = parameters.get("destination", [""])[0]

            # Validate the selected locations.
            if source not in LOCATIONS or destination not in LOCATIONS:
                self.send_json(
                    {"error": "Please select valid city locations."},
                    status=400
                )
                return

            route, distance = find_shortest_path(source, destination)

            if route is None:
                self.send_json(
                    {"error": "No route found between these locations."},
                    status=404
                )
                return

            result = {
                "source": source,
                "destination": destination,
                "route": route,
                "distance": distance
            }

            self.send_json(result)
            return

        # Serve index.html, CSS, JavaScript, and other static files.
        super().do_GET()

    def send_json(self, data, status=200):
        """Send a JSON response to the browser."""
        response = json.dumps(data).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(response)


def main():
    """Start the web server and open the project in a browser."""

    server = ThreadingHTTPServer((HOST, PORT), RouteFinderHandler)

    print("=" * 45)
    print("       SMART CITY ROUTE FINDER")
    print("=" * 45)
    print(f"Website: http://{HOST}:{PORT}")
    print("Server is running.")
    print("Press Control + C to stop the server.")
    print("=" * 45)

    # Open the website shortly after the server starts.
    threading.Timer(
        1.0,
        lambda: webbrowser.open(f"http://{HOST}:{PORT}")
    ).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping the server...")
    finally:
        server.server_close()
        print("Server stopped.")


if __name__ == "__main__":
    main()
