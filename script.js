
/* ==========================================
   SMART CITY ROUTE FINDER
   File: script.js
   Purpose: Draw the city map and find routes.
   ========================================== */

const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");
const routeForm = document.getElementById("routeForm");
const swapButton = document.getElementById("swapButton");
const findRouteButton = document.getElementById("findRouteButton");

const cityMap = document.getElementById("cityMap");
const formMessage = document.getElementById("formMessage");
const totalDistance = document.getElementById("totalDistance");
const routeSteps = document.getElementById("routeSteps");
const resultStatus = document.getElementById("resultStatus");
const resultPanel = document.getElementById("resultPanel");

// Keep the city data and selected route available to the map.
let cityData = null;
let selectedRoute = [];

// Fixed positions for the seven locations in the SVG map.
// Coordinates are used only for drawing the visual network.
const positions = {
    "University": { x: 110, y: 95 },
    "Hospital":   { x: 285, y: 65 },
    "Airport":    { x: 475, y: 85 },
    "Bus Stand":  { x: 130, y: 255 },
    "Mall":       { x: 310, y: 205 },
    "Station":    { x: 500, y: 280 },
    "Park":       { x: 300, y: 345 }
};


/* ------------------------------------------
   1. Load city locations and roads from Python
   ------------------------------------------ */

async function loadCityData() {
    try {
        formMessage.textContent = "Loading city network...";

        const response = await fetch("/api/city");

        if (!response.ok) {
            throw new Error("Could not load city data.");
        }

        cityData = await response.json();

        // Fill both dropdowns with city locations.
        populateLocations();

        // Draw the initial road network.
        drawCityMap();

        formMessage.textContent =
            "City network loaded. Select your starting point and destination.";

        // Choose useful defaults.
        sourceSelect.value = "University";
        destinationSelect.value = "Station";

    } catch (error) {
        console.error(error);

        formMessage.textContent =
            "Unable to load city data. Check that the Python server is running.";

        cityMap.innerHTML =
            '<p class="map-placeholder">Unable to load the city map.</p>';
    }
}


/* ------------------------------------------
   2. Fill the source and destination dropdowns
   ------------------------------------------ */

function populateLocations() {
    sourceSelect.innerHTML = "";
    destinationSelect.innerHTML = "";

    cityData.locations.forEach(location => {
        const sourceOption = document.createElement("option");
        sourceOption.value = location;
        sourceOption.textContent = location;
        sourceSelect.appendChild(sourceOption);

        const destinationOption = document.createElement("option");
        destinationOption.value = location;
        destinationOption.textContent = location;
        destinationSelect.appendChild(destinationOption);
    });
}


/* ------------------------------------------
   3. Draw the city map using SVG
   ------------------------------------------ */

function drawCityMap() {
    if (!cityData) return;

    // SVG elements let us draw roads, labels and location markers.
    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 600 410");
    svg.setAttribute("role", "img");
    svg.setAttribute(
        "aria-label",
        "City road network with seven locations"
    );

    // Draw all roads first, so markers appear above them.
    cityData.roads.forEach(road => {
        const start = positions[road.start];
        const end = positions[road.end];

        if (!start || !end) return;

        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);
        line.setAttribute("x2", end.x);
        line.setAttribute("y2", end.y);

        const isRouteRoad = selectedRoute.some((location, index) => {
    if (index === selectedRoute.length - 1) {
        return false;
    }

    const nextLocation = selectedRoute[index + 1];

    return (
        (road.start === location && road.end === nextLocation) ||
        (road.end === location && road.start === nextLocation)
    );
});

        line.setAttribute(
            "stroke",
            isRouteRoad ? "#16845b" : "#aab8cc"
        );

        line.setAttribute("stroke-width", isRouteRoad ? "6" : "3");
        line.setAttribute("stroke-linecap", "round");

        svg.appendChild(line);

        // Display the road distance near the middle of the road.
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", (start.x + end.x) / 2);
        label.setAttribute("y", (start.y + end.y) / 2 - 8);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "11");
        label.setAttribute("font-weight", "600");
        label.setAttribute("fill", "#52627a");
        label.setAttribute("stroke", "#f7faff");
        label.setAttribute("stroke-width", "4");
        label.setAttribute("paint-order", "stroke");
        label.textContent = `${road.distance} km`;

        svg.appendChild(label);
    });

    // Draw each city location.
    cityData.locations.forEach(location => {
        const point = positions[location];
        if (!point) return;

        const isSelected = selectedRoute.includes(location);
        const isStart = selectedRoute.length > 0 &&
            location === selectedRoute[0];
        const isEnd = selectedRoute.length > 0 &&
            location === selectedRoute[selectedRoute.length - 1];

        const group = document.createElementNS(svgNS, "g");

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", "10");

        let markerColor = "#2457d6";

        if (isSelected) markerColor = "#16845b";
        if (isStart) markerColor = "#2457d6";
        if (isEnd) markerColor = "#e58a19";

        circle.setAttribute("fill", markerColor);
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "3");

        group.appendChild(circle);

        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", point.x);
        label.setAttribute("y", point.y + 27);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "12");
        label.setAttribute("font-weight", "700");
        label.setAttribute("fill", "#17233d");
        label.setAttribute("stroke", "#f7faff");
        label.setAttribute("stroke-width", "4");
        label.setAttribute("paint-order", "stroke");
        label.textContent = location;

        group.appendChild(label);
        svg.appendChild(group);
    });

    cityMap.replaceChildren(svg);
}


/* ------------------------------------------
   4. Ask Python to calculate the shortest route
   ------------------------------------------ */

async function findRoute(event) {
    event.preventDefault();

    const source = sourceSelect.value;
    const destination = destinationSelect.value;

    if (!source || !destination) {
        formMessage.textContent = "Please select both locations.";
        return;
    }

    findRouteButton.disabled = true;
    findRouteButton.textContent = "Calculating route...";
    formMessage.textContent = "Finding the shortest route...";

    try {
        const query = new URLSearchParams({
            source: source,
            destination: destination
        });

        const response = await fetch(`/api/route?${query.toString()}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to find the route.");
        }

        // Save the route so the map can highlight its roads.
        selectedRoute = result.route;

        totalDistance.textContent = result.distance;
        resultStatus.textContent = "Route found";
        resultPanel.classList.remove("is-error");
        resultPanel.classList.add("is-success");

        // Display the route as an ordered list.
        routeSteps.replaceChildren();

        result.route.forEach(location => {
            const item = document.createElement("li");
            item.textContent = location;
            routeSteps.appendChild(item);
        });

        formMessage.textContent =
            `Shortest route found: ${result.distance} km.`;

        drawCityMap();

    } catch (error) {
        console.error(error);

        selectedRoute = [];
        totalDistance.textContent = "--";
        resultStatus.textContent = "Route unavailable";
        resultPanel.classList.remove("is-success");
        resultPanel.classList.add("is-error");

        routeSteps.replaceChildren();

        const item = document.createElement("li");
        item.textContent = error.message;
        routeSteps.appendChild(item);

        formMessage.textContent = error.message;

        drawCityMap();

    } finally {
        findRouteButton.disabled = false;
        findRouteButton.innerHTML =
            'Find Shortest Route <span aria-hidden="true">→</span>';
    }
}


/* ------------------------------------------
   5. Swap the selected locations
   ------------------------------------------ */

function swapLocations() {
    const oldSource = sourceSelect.value;
    const oldDestination = destinationSelect.value;

    sourceSelect.value = oldDestination;
    destinationSelect.value = oldSource;
}


/* ------------------------------------------
   6. Connect the buttons and start the app
   ------------------------------------------ */

routeForm.addEventListener("submit", findRoute);
swapButton.addEventListener("click", swapLocations);

loadCityData();
