import { apiKey, baseURL } from "../utils";
const orders = {

    getOrders: async function getOrders() {
        const response = await fetch(`${baseURL}/orders?api_key=${apiKey}`);

        return (await response.json()).data;
        console.log(this.orders);
    },
    updateOrder: async function(response, para) {
        const update = {

            id: response,
            status_id: para,
            api_key: apiKey
        };
        await fetch ("https://lager.emilfolino.se/v2/orders", {
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
