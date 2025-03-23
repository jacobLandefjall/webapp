
import deliveriesModel from "../models/deliveries.js";

export default class DeliveriesList extends HTMLElement {
    constructor() {
        super();

        this.deliveries = [];
    }
    // connect component
    async connectedCallback() { // Hämtar produkterna
        this.deliveries = await deliveriesModel.getDeliveries();
        console.log(this.deliveries);

        this.render();
    }

    render() {
        if (this.deliveries.length > 0) {
            const deliveryList = this.deliveries.map((delivery) => {
                return `<div class="delivery-item">
                <p>Antal: ${delivery.amount}</p>
                <p>Produkt: ${delivery.product_id}</p>
                <p>Leveransdatum: ${delivery.delivery_date}</p>
                <p>Kommentar: ${delivery.comment || 'Ingen kommentar'}</p>
                </div>`;
            }).join("");

            this.innerHTML = `<h2>Inleveranser</h2><a href='#deliveries-form' class="button
         blue-button">Ny leverans</a>
         ${deliveryList}`;
        } else {
            this.innerHTML = `<h2>Inga inleveranser</h2><a href='#deliveries-form' class="button
            blue-button">Ny leverans</a>
            <p>Inga Inleveranser att visa</p>`;
        }
    }
}
