import { apiKey, baseURL } from "../utils.js";
import { UploadClient } from "https://cdn.jsdelivr.net/npm/@uploadcare/upload-client@6.14.1/dist/esm/index.browser.mjs";


export default class MapView extends HTMLElement {
    constructor() {
        super();
        this.order = "";
        this.videoStream = null;
    }

    static get observedAttributes() {
        return ['order'];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        this[property] = newValue;
    }

    async connectedCallback() {        
        const orderId = window.location.hash.split("/")[1];
        this.order = await this.fetchOrderDetails(orderId);
        console.log("Hämtad orderdata:", this.order);
        if (this.order) {
            this.render();
            this.renderMap();
        } else {
            this.innerHTML = `<p>Ordern kunde inte hittas.</p>`;
        }
    }

    async fetchOrderDetails(orderId) {
        const response = await fetch(`${baseURL}/orders/${orderId}?api_key=${apiKey}`);
        const data = await response.json();
        console.log("fetchOrderDetails - API-svar:", data);
        return data.data;
    }

    render() {
        const { id, name, address } = this.order;

        this.innerHTML = `
            <header class="header">
                <lager-title title="Orderdetaljer"></lager-title>
            </header>
            <div class="container">
                <h2>Order ID: ${id}</h2>
                <p><strong>Kund:</strong> ${name}</p>
                <p><strong>Adress:</strong> ${address}</p>
                <div id="map" class="map"></div>

                <!-- Foto -->
                <button id="takePhotoButton">Ta ett foto</button>
                <div class="camera-container">
                    <video id="video" width="320" height="240" autoplay></video>
                    <div id="photoResult" style="display:none;">
                        <p>Foto har tagits</p>
                        <button id="deliverButton" style="display:none;">Gör leverans</button>
                        <img id="takenPhoto" width="320" height="240" alt="Taken photo" />
                    </div>
                </div>
            </div>
            <div id="photoModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <h3>Bekräfta bilden</h3>
                    <img id="modalPhoto" src="" alt="Preview" style="width: 100%; max-width: 300px;" />
                    <div class="modal-buttons">
                        <button id="confirmPhoto">Bekräfta</button>
                        <button id="retakePhoto">Ta om</button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupPhotoTaking();
        this.setupVideoStream();
    }

    setupPhotoTaking() {
        const takePhotoButton = document.getElementById("takePhotoButton");
        const photoResult = document.getElementById("photoResult");
        const takenPhoto = document.getElementById("takenPhoto");
        const deliverButton = document.getElementById("deliverButton");
    
        takePhotoButton.addEventListener("click", async () => {
            takePhotoButton.disabled = true;
            takePhotoButton.innerText = "Tar foto...";
        
            try {
                const photoBlob = await this.takePhoto();
                const photoUrl = URL.createObjectURL(photoBlob);
        
                const modal = document.getElementById("photoModal");
                const modalImg = document.getElementById("modalPhoto");
                modalImg.src = photoUrl;
                modal.style.display = "flex";
        
                document.getElementById("confirmPhoto").onclick = async () => {
                    modal.style.display = "none";
        
                    const cdnUrl = await this.uploadPhoto(photoBlob);
                    this.cdnUrl = cdnUrl;

                    if (cdnUrl) {
                        deliverButton.style.display = "block";

                        deliverButton.addEventListener("click", async () => {
                            await fetch(`${baseURL}/orders/${this.order.id}?api_key=${apiKey}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id: this.order.id,
                                    status_id: 400,
                                    image_url: this.cdnUrl
                                })
                            });
                            window.location.hash = "#/delivered-orders";
                        }, { once: true });
                    } else {
                        alert("Kunde inte ladda upp bilden. Försök igen.");
                    }
                };

                // Ta om
                document.getElementById("retakePhoto").onclick = () => {
                    modal.style.display = "none";
                };

            } catch (error) {
                console.error("Fel när foto skulle tas:", error);
            } finally {
                takePhotoButton.disabled = false;
                takePhotoButton.innerText = "Ta ett foto";
            }
        });
    }

    takePhoto() {
        return new Promise((resolve, reject) => {
            const video = document.getElementById("video");
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Kunde inte skapa bild-blob"));
                }
            }, 'image/png');
        });
    }

    async uploadPhoto(photoBlob) {
        try {
            const client = new UploadClient({ publicKey: '682532beb7e512f0a63c' });
            const fileInfo = await client.uploadFile(photoBlob);
            const cdnUrl = fileInfo.cdnUrl;
    
            const payload = {
                id: this.order.id,
                name: this.order.name,
                api_key: apiKey,
                status_id: 400,
                image_url: cdnUrl
            };
    
            const response = await fetch(`${baseURL}/orders`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Update failed:", errorData);
                throw new Error(`HTTP error: ${response.status}`);
            }
    
            console.log("Order uppdaterad!");
            return cdnUrl;
        } catch (error) {
            console.error("Uppladding misslyckad:", error);
            return null;
        }
    }

    setupVideoStream() {
        const video = document.getElementById('video');

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    this.videoStream = stream;
                    video.srcObject = stream;
                })
                .catch((err) => {
                    console.error("Kunde inte hämta videoström:", err);
                });
        }
    }

    startVideo() {
        const video = document.getElementById('video');
        if (this.videoStream) {
            video.srcObject = this.videoStream;
        }
    }

    pauseVideo() {
        const video = document.getElementById('video');
        video.srcObject.getTracks().forEach(track => track.stop()); // Stoppa videoströmmen
    }

    renderMap() {
        this.map = L.map('map').setView([56.18219, 15.59094], 11);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
        }).addTo(this.map);
    
        // Lägg till detta direkt efter tileLayer
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "location.png",
            iconUrl: "location.png",
            shadowUrl: "location.png"
        });
    
        this.renderMarkers();
        this.renderLocation();
    }

    async getCoordinates(address) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }    

    async renderMarkers() {
        let coordinates = [56.2345, 15.6034];
    
        L.marker(coordinates).addTo(this.map);
    
        let adress = "Stortorget 1, Karlskrona";
    
        const results = await this.getCoordinates(adress);
    
        L.marker([
            parseFloat(results[0].lat),
            parseFloat(results[0].lon)
        ]).addTo(this.map);
    }
    
    renderLocation() {
        let locationMarker = L.icon({
            iconUrl:      "location.png",
            iconSize:     [24, 24],
            iconAnchor:   [12, 12],
            popupAnchor:  [0, 0]
        });

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                L.marker(
                    [position.coords.latitude, position.coords.longitude],
                    {icon: locationMarker}
                ).addTo(this.map);
            });
        }
    }
}
