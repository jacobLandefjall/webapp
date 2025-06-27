import orders from "../models/orders.js";
console.log(orders); // Ska inte vara undefined

export default class WildcardList extends HTMLElement {
    constructor() {
        super();

        this.orders = [];
    }

    // connect component
    async connectedCallback() {
        const allOrders = await orders.getOrders(); // Hämta alla ordrar

        this.orders = allOrders.filter(order => order.status_id === 200);

        this.render();
    }

    render() {
        if (this.orders.length === 0) {
            this.innerHTML = `<h2>Inga packade ordrar att visa</h2>`;
            return;
        }
        const list = this.orders
        .map(order => `<p><a href='#map/${order.id}'class="order-link">Order ID: ${order.id}</a></p>`)
        .join("");

        this.innerHTML = `<h2>Orderlista</h2>${list}`;
    }
}
