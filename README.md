Smart City Route Finder

A web-based DAA mini-project that calculates the shortest route between city locations using Dijkstra's Algorithm.

Built using Python, HTML, CSS, and JavaScript.

Project Overview

Smart City Route Finder represents a city as a weighted, undirected graph. Each location is a vertex, and each road is an edge with a distance measured in kilometres.

Users can select a starting location and destination, calculate the shortest route, and view the result on an interactive city map.

Features

- Interactive city road network
- Seven predefined city locations
- Source and destination selection
- Shortest-path calculation using Dijkstra's Algorithm
- Visual route highlighting
- Total distance calculation
- Responsive web dashboard
- Python backend without external frameworks

Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend and algorithm |
| Dijkstra's Algorithm | Shortest-path calculation |
| HTML | Dashboard structure |
| CSS | User interface design |
| JavaScript | Map visualization and API communication |
| Python HTTP Server | Local web server |

Project Structure

```text
Smart_City_Route_Finder/
├── main.py
├── city_data.py
├── dijkstra.py
├── index.html
├── style.css
├── script.js
├── requirements.txt
├── .gitignore
├── screenshots/
│   └── dashboard.png
└── README.md
```

Installation and Setup

1. Clone the repository

```bash
git clone https://github.com/Mantu-code/Smart-City-Route-Finder.git
```

2. Open the project directory

```bash
cd Smart-City-Route-Finder
```

3. Run the application**

```bash
python3 main.py
```

4. Open your browser**

Visit:

http://127.0.0.1:8000

No external Python packages are required.

Example Output

Source: University

Destination: Station

Shortest route: University -> Bus Stand -> mall -> Station

Total distance: 7 km

Another route may be returned if multiple paths have the same minimum distance.

Algorithm

Dijkstra's Algorithm finds the shortest paths from a source vertex in a graph with non-negative edge weights.

The implementation uses a priority queue to efficiently select the next location with the smallest known distance.

Time Complexity:** O((V + E) log V)

Where:

- V = Number of vertices (locations)
- E = Number of edges (roads)

Screenshots

![Smart City Route Finder Dashboard](screenshots/
<img width="1418" height="845" alt="Screenshot 2026-10-17 at 16 09 44" src="https://github.com/user-attachments/assets/942a46c3-822b-4333-a213-1ce2a54adf31" />
<img width="1420" height="595" alt="Screenshot 2026-10-17 at 16 08 08" src="https://github.com/user-attachments/assets/91b4d7c2-9d67-4b21-9741-988fd800d69c" />
<img width="1420" height="791" alt="Screenshot 2026-10-17 at 16 10 02" src="https://github.com/user-attachments/assets/beba13d7-a7aa-4666-a783-ef58a8570f8e" />
)


Future Enhancements

- Real-world map integration
- Live traffic information
- Additional city locations
- Travel-time estimation

Academic Information

Subject: Design and Analysis of Algorithms (DAA)

Project Type: Academic Mini-Project

Author: Mantu Kunda

Institution: Chandigarh University

---

Developed as an academic project to demonstrate graph representation and shortest-path by Dijkstra algorithms.
