export default class MapView extends HTMLElement {
 // Lägg in kod för kartan här.
    constructor() {
        super();
        
        this.order = "";
        this.map = null;
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

    // connect component
    connectedCallback() {
        // använd order modell för att hämta order data
        this.innerHTML = `<h1>MapView</h1><h2>${this.order}</h2><div id="map" class="map"></div>`;
        // Gor om adress till koordinater
        this.render();
    }

    renderMap() {
        console.log(this.order); // i order ska vi ha orderId för att hämta order data

        this.map = L.map("map").setView([59.3293, 18.0686], 13);
        
    }
}
