/**
 * JSON objekt innehåller funktioner som jobbar mot API:et.
 * Fetch funktioner för att hämta produkter och ordrar.
 * Snyggare och bättre strukturerad kod.
 */
import { apiKey, baseURL } from "../utils.js";

// Skapar en funktion för varje request mot products i lager.
const products = {
    getProducts: async function getProducts() {
        const response = await fetch(`${baseURL}/products?api_key=${apiKey}`);
        const result = await response.json();

        return result.data;
    },

    updateProduct: async function updateProduct(productObject) {
        const updatedProduct = {
            ...productObject,  // Spread operator
            "api_key": apiKey
        };

        const response = await fetch(`${baseURL}/orders`, {
            body: JSON.stringify(updatedProduct),
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT"
        });

        return response;
    },

    getOrders: async function getOrders() {
        const response = await fetch(`${baseURL}/orders?api_key=${apiKey}`);
        const result = await response.json();

        // Resultat till this.orders och filtera ut alla ordrar som har status 100
        return result.data;

        //console.log(this.orders);
    }
};

export default products;
