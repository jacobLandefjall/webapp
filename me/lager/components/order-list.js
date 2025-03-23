import { apiKey, baseURL } from "../utils.js";

export default class OrderList extends HTMLElement {
    constructor() {
        super();

        this.orders= [];
    }

    // connect component
    async connectedCallback() {
        const response = await fetch(`${baseURL}/orders?api_key=${apiKey}`)
        const result = await response.json();

        this.orders = result.data.filter(response=>"Ny" === response.status);

        console.log(this.orders);
        this.render();
    }

    render() {
        const list = this.orders.map(list =>`<single-order order='${JSON.stringify(list)}'></single-order>`).join("");

        this.innerHTML = `<h2>Packlista</h2>${list}`;
    }
};
