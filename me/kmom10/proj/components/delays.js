import { api_base } from "../utils.js";
import { setFavorites, getFavorites } from "./favorites.js";

/* Requirement 1 to get all delayed trains */

// Extra requirement to add favorites
function isLoggedIn() {
    return !!localStorage.getItem("token");
}

// Fetch all delayed trains
async function fetchStations() {
    const response = await fetch(`${api_base}/stations`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
}

// Fetch all delayed trains
async function fetchDelayedTrains() {
    const response = await fetch(`${api_base}/delayed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
}

// Fetch delayed trains for a specific station
async function getDelayedTrainsForStation() {
    try {
        const [stations, delays] = await Promise.all([
            fetchStations(),
            fetchDelayedTrains()
        ]);

        
        const station = stations.data;
        const delay = delays.data;

        const stationMap = {};
        station.forEach(t_station => {
            stationMap[t_station.LocationSignature] = t_station.AdvertisedLocationName;
        });

        // Add station names to the delay data
        const updatedDelays = delay.map(train => ({
            advertisedTimeAtLocation: train.AdvertisedTimeAtLocation,
            estimatedTimeAtLocation: train.EstimatedTimeAtLocation,
            from: stationMap[train.FromLocation?.[0]?.LocationName] || "Okänd",
            to: stationMap[train.ToLocation?.[0]?.LocationName] || "Okänd",
            trainId: train.ActivityId
        }));

        return updatedDelays;
    } catch (error) {
        console.error("Error fetching delayed trains:", error);
        return [];
    }
}

// Extra req to search input and filter functionality
function createSearchInput(dealys) {
    const searchContainer = document.createElement('div');
    searchContainer.className = "search-container";

    const searchInput = document.createElement('input');
    searchInput.type = "text";
    searchInput.placeholder = "Sök station...";
    searchInput.className = "search-input";

    const searchButton = document.createElement('button');
    searchButton.innerText = "Sök";
    searchButton.className = "search-button";

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);

    return { searchContainer, searchInput, searchButton }; // Create search input
}

// Display delayed trains in a table
document.addEventListener('DOMContentLoaded', async () => {
    const delays = await getDelayedTrainsForStation();
    const container = document.createElement('div');
    container.innerHTML = "<h2>Förseningar i Tågtrafiken</h2>";

    if (isLoggedIn()) {
    const favBtn = document.createElement("button");
    favBtn.innerText = "Visa mina favoriter";
    favBtn.className = "search-button";
    favBtn.addEventListener("click", async () => {
        const favorites = await getFavorites();
        const favPlaces = favorites.map(f => f.place);

        const filtered = delays.filter(train =>
            favPlaces.includes(train.from)
        );

        displayResults(filtered);
    });

    container.appendChild(favBtn);
}

    // Create search input
    const { searchContainer, searchInput, searchButton } = createSearchInput(delays);
    container.appendChild(searchContainer);

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = "results-container";
    container.appendChild(resultsContainer);

    // Display the results
    const displayResults = (filteredDelays) => {
        resultsContainer.innerHTML = ' ';

        if (filteredDelays.length === 0) {
            resultsContainer.innerHTML = "<p>Inga förseningar hittades.</p>";
            return;
        }

        filteredDelays.forEach(train => {
            const div = document.createElement('div');
            div.className = "train-info";
            div.innerHTML = `
                <strong>Från:</strong> ${train.from}<br>
                <strong>Till:</strong> ${train.to}<br>
                <strong>Avgång:</strong> ${new Date(train.advertisedTimeAtLocation).toLocaleTimeString()} <br>
                <strong>Beräknad avgång:</strong> ${new Date(train.estimatedTimeAtLocation).toLocaleTimeString()} <br>
            `;

            if (isLoggedIn()) {
                const favBtn = document.createElement("button");
                favBtn.innerText = "Spara som favorit station";
                favBtn.className = "search-button";
                favBtn.addEventListener("click", async () => {
                    await setFavorites({ place: train.from });
                    alert(`${train.from} sparad som favorit.`);
                });
                div.appendChild(favBtn); // ← Nu är div definierad innan
            }

            resultsContainer.appendChild(div);
        });
    };

    // Initial display of all delays
    displayResults(delays);

    // Serch functionality
    const serchFunctionality = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            displayResults(delays);
            return;
        }

        const filteredDelays = delays.filter(train =>
            train.from.toLowerCase().includes(searchTerm) ||
            train.to.toLowerCase().includes(searchTerm)
        );

        displayResults(filteredDelays);
    };

    searchButton.addEventListener('click', serchFunctionality);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            serchFunctionality();
        }
    });

    document.querySelector("main").appendChild(container);
});


