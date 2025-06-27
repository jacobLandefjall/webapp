import { apiKey, baseURL } from "../utils.js";

const orders = {

    getOrders: async function getOrders() {
        const response = await fetch(`${baseURL}/orders?api_key=${apiKey}`);

        const data = await response.json();
        const packedOrders = data.data.filter(order => order.status_id === 200);

        console.log(packedOrders); // Kontrollera i konsolen

        return packedOrders;
    },

    updateOrder: async function(response, para) {
        const update = {
            id: response,
            status_id: para,
            api_key: apiKey
        };

        await fetch("https://lager.emilfolino.se/v2/orders", {
            body: JSON.stringify(update),
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT"
        });
    }
};

console.log(orders.getOrders());

export default orders;
