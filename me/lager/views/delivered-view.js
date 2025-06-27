import { apiKey, baseURL } from "../utils.js";

export default class DeliveredOrders extends HTMLElement {
    async connectedCallback() {
        console.log(" DeliveredOrders komponent laddades");
        try {
            // Hämtar alla ordrar från API.
            const response = await fetch(`${baseURL}/orders?api_key=${apiKey}`);
            const data = await response.json();
            console.log("API Response Data:", data);
            console.log("First order example:", data.data[0]);
            
            const skickadeOrdrar = data.data.filter(order => order.status_id === 400);
            
            console.log("Antal ordrar:", data.data.length);
            console.log("Antal ordrar med status 400:", skickadeOrdrar.length);
            
            // Visa lista med alla status_id som finns
            const statusIds = [...new Set(data.data.map(order => order.status_id))];
            console.log("Tillgängliga status_id:", statusIds);

            if (skickadeOrdrar.length === 0) {
                this.innerHTML = `
                    <header class="header">
                        <lager-title title="Levererade ordrar"></lager-title>
                    </header>
                    <main class="main">
                        <p>Inga levererade ordrar (status 400) hittades.</p>
                        <p>Tillgängliga ordrar har status: ${statusIds.join(', ')}</p>
                        <p>För att testa denna vy, ändra status på en order till 400 eller leverera en order via kartvyn.</p>
                    </main>
                `;
                return;
            }

            this.innerHTML = `
                <header class="header">
                    <lager-title title="Levererade ordrar"></lager-title>
                </header>
                <main class="main">
                    <div class="delivered-orders">
                    <h2>Levererade ordrar</h2>
                        ${skickadeOrdrar.map(order => `
                            <div class="order-card fade-in">
                                <h2>Order #${order.id}</h2>
                                <p><strong>Kund:</strong> ${order.name}</p>
                            </div>
                        `).join('')}
                    </div>
                </main>
            `;
        } catch (error) {
            console.error("Fel vid hämtning av ordrar:", error);
            this.innerHTML = `
                <header class="header">
                    <lager-title title="Levererade ordrar"></lager-title>
                </header>
                <main class="main">
                    <p>Ett fel uppstod vid hämtning av levererade ordrar.</p>
                </main>
            `;
        }
    }
}
