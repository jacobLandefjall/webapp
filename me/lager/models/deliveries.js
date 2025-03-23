/**
 * JSON objekt innehåller funktioner som jobbar mot API:et.
 * Fetch funktioner för att hämta produkter och ordrar.
 * Snyggare och bättre strukturerad kod.
 */
import { apiKey, baseURL } from "../utils.js";

// Skapar en funktion för varje request mot products i lager.
const deliveries = {
    getDeliveries: async function getDeliveries() {
        console.log("Hämtar leveranser");
        const response = await fetch(`${baseURL}/deliveries?api_key=${apiKey}`);
        const result = await response.json();

        console.log("Leveranser hämtade;", result.data);

        return result.data;
    },
    // anropar createDelivery och gör ett API-anrop
    createDelivery: async function createDelivery(delivery) {
        console.log("Skapar leverans;", JSON.stringify(delivery));
        const response = await fetch(`${baseURL}/deliveries`, {
            method: "POST",
            headers: {
                "content-type": "application/json"

            },
            body: JSON.stringify({
                "product_id": delivery.product_id,
                "amount": delivery.amount,
                "delivery_date": delivery.delivery_date,
                "comment": delivery.comment,
                "api_key": apiKey
            })
        });

        const data = await response.json();

        console.log("Svar från att skapa leverans:", data);
        return data;
        //return response.json();
    },

    updateStock: async function updateStock(productId, amount) {
        console.log(`Uppdaterar lager för produktID ${productId} med ${amount}...`);
        const response = await fetch(`${baseURL}/products/${productId}?api_key=${apiKey}`);
        const product = await response.json();

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            response.json().then(data => {
                console.error("Error response from server:", data);
            });
            return;
        }

        const newStock = product.data.stock + amount; // Räknar ut nytt lagerantal

        console.log(`Nytt lagerantal för produktID ${productId}: ${newStock}`);

        const updateRes = await fetch(`${baseURL}/products`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "id": productId,
                "stock": newStock,
                "api_key": apiKey
            })
        });

        if (updateRes.ok) {
            console.log(`ProduktID: ${productId} har uppdaterats med ${newStock}`);
        } else {
            const errorRes = await updateRes.json();

            console.log("Misslyckades att uppdatera", errorRes);
        }
    },

    checkDelivery: async function checkDelivery(product_id, amount, delivery_date, comment) {
        console.log(`Kontrollerar och skapar leverans för produktID ${product_id}...`);
        const delivery = { product_id, amount, delivery_date, comment };
        const response = await deliveries.createDelivery(delivery);

        if (response.ok) { // kontrollera om POST-anropet lyckades
            await deliveries.updateStock(product_id, amount);
        } else {
            console.error("Misslyckades att skapa delivery", response);
        }
    }
};

export default deliveries;
