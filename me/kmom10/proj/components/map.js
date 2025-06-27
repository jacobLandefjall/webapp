const stationSelect = document.getElementById('station-select');
let stationMap = new Map();
let map;
let currentMarker;
let stationLatLng = [59.330231, 18.059196]; // fallback coordinates (Stockholm)

// Get all stations from the API and populate the select element.
async function fetchStations() {
    const response = await fetch('https://trafik.emilfolino.se/stations');
    const data = await response.json();
    stationSelect.innerHTML = '<option value="">-- Välj station --</option>';
    data.data.forEach(station => {
        const match = station.Geometry.WGS84.match(/POINT \(([\d.]+) ([\d.]+)\)/);
        if (!match) return;
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        stationMap.set(station.LocationSignature, { name: station.AdvertisedLocationName, lat, lng });

        const option = document.createElement('option');
        option.value = station.LocationSignature;
        option.textContent = station.AdvertisedLocationName;
        stationSelect.appendChild(option);
    });
}

// Initialize the map with a default view.
function initMap() {
    map = L.map('map').setView(stationLatLng, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    currentMarker = L.marker(stationLatLng).addTo(map).bindPopup('Tågstation').openPopup();
}

// Draw a circle around the selected station based on the delay time.
function drawWalkingCircle() {
    const delayMinutes = parseInt(document.getElementById('delay-minutes').value);
    const margin = 2;
    const walkingSpeed = 100;

    if (isNaN(delayMinutes) || delayMinutes <= margin) {
        alert('Ange en förseningstid större än 2 minuter.');
        return;
    }

    const oneWayDistance = ((delayMinutes - margin) / 2) * walkingSpeed;

    L.circle(stationLatLng, {
        radius: oneWayDistance,
        color: 'blue',
        fillColor: '#3a6ea5',
        fillOpacity: 0.3
    }).addTo(map);
}

// When the user selects a station, update the map.
stationSelect.addEventListener('change', () => {
    const selected = stationSelect.value;
    if (!stationMap.has(selected)) return;

    const { lat, lng, name } = stationMap.get(selected);
    stationLatLng = [lat, lng];

    map.setView(stationLatLng, 15);

    if (currentMarker) {
        currentMarker.remove();
    }
    currentMarker = L.marker(stationLatLng).addTo(map).bindPopup(name).openPopup();
});

document.getElementById('draw-radius').addEventListener('click', drawWalkingCircle);

await fetchStations();
initMap();

// Draw out delayed trains on the map.
async function drawDelayedTrains() {
    const response = await fetch('https://trafik.emilfolino.se/delayed');
    const data = await response.json();

    data.data.forEach(train => {
        const locationSig = train.LocationSignature;
        const station = stationMap.get(locationSig);
        if (!station) return;

        const advertised = new Date(train.AdvertisedTimeAtLocation);
        const estimated = new Date(train.EstimatedTimeAtLocation);
        const delayed = Math.round((estimated - advertised) / 60000);

        if (delayed <= 0) return;

        const marker = L.marker([station.lat, station.lng], {
            icon: L.icon({ iconUrl: '../img/train.jpg', iconSize: [25, 25] }) })
            .addTo(map)
            .bindPopup(`<strong>${station.name}</strong><br>
                Tåg ${train.AdvertisedTrainIdent}<br>
                Förseningar: ${delayed} minuter<br>
                `);
            });
}

// Function to connect to the socket and listen for delayed trains.
function connectToSocket() {
    const socket = io('https://trafik.emilfolino.se');

    const trainMarker = new Map();

    socket.on('position', (data) => {
        const { train, position } = data;
        const latLng = [position[0], position[1]];

        if (trainMarker.has(train)) {
            trainMarker.get(train).setLatLng(latLng);
        } else {
            const marker = L.circleMarker(latLng, {
                radius: 7,
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.9
            }).addTo(map).bindPopup(`Liveposition för tåg ${train}`);

            trainMarker.set(train, marker);
        }
    });
}
connectToSocket();
await drawDelayedTrains();
