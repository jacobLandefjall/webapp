import productsModel from '../models/products.js';
import deliveries from '../models/deliveries.js';
import { apiKey } from '../utils.js';

export default class NewDelivery extends HTMLElement {
// label för varje input för att beskriva vad som ska fyllas i
    constructor() {
        super();

        this.delivery = {};

        this.products = [];
    }

    async connectedCallback() {
        this.products = await productsModel.getProducts();
        this.render();
    }

    async createDelivery() {
        if (!this.delivery.product_id || this.delivery.amount <= 0) {
            console.error("Produkt ID och antal måste vara rätt.");
            this.displayError("Produkt ID och antal måste vara rätt.");
            return;
        }

        // Skapar leveransen med id, anta, datum och kommentar.
        try {
            const deliveryData = {
                product_id: this.delivery.product_id,
                amount: this.delivery.amount,
                delivery_date: this.delivery.delivery_date || new Date().toISOString().split('T')[0],
                comment: this.delivery.comment,
                api_key: apiKey
            };

            // Skickar objektet till createDelivery
            const deliveryResponse = await deliveries.createDelivery(deliveryData);

            console.log(deliveryResponse);


            if (deliveryResponse.status === 201) {
                console.log("Leveransen har skapats");
                let test = await deliveries.updateStock(this.delivery.product_id,
                    this.delivery.amount);

                console.log(test);
                alert('Leveransen har skapats');
                window.location.href = "http://localhost:9000/#deliveries";
            } else {
                await deliveries.updateStock(this.delivery.product_id, this.delivery.amount);
                console.log(deliveryResponse);
            }
        } catch (error) {
            console.error("Fel att skapa leverans", error.message, error);
        }
    }
    dispayDeliveryInfo(deliveryData) {
        const message = `Leverans skapad för ${deliveryData.product_id},

        Antal: ${deliveryData.amount}  på ${deliveryData.delivery_date}`;
        console.log(message);
        alert(message);
    }

    render () {

        let form = document.createElement('form'); // skapar ett formulär

        form.addEventListener("submit", (event) => {
            event.preventDefault(); // förhindrar att sidan laddas om

            if (this.delivery.product_id > 0) {
                this.createDelivery();
            }
        });

        let submitButton = document.createElement('input'); // skapar en knapp

        submitButton.setAttribute("type", "submit"); // sätter typen till submit
        submitButton.setAttribute("value", "Skapa inleverans"); // sätter värdet "Skapa inleverans"
        submitButton.classList.add("amount", "inleverans"); // lägger till klasserna button

        let select = document.createElement("select");

        select.setAttribute("required", "required"); // sätter attributet required
        select.classList.add("input"); // lägger till klassen input

        let option = document.createElement("option");

        option.setAttribute("value", -99); // value till 99
        option.textContent = "Välj produkt";
        option.classList.add("placeholder"); // style
        select.appendChild(option);

        this.products.forEach((item) => {
            let option = document.createElement("option");

            option.setAttribute("value", item.id); // sätter attributet value
            option.dataset.stock = item.stock; // Skickar med som redan finns i lagret
            option.textContent = item.name; // Namn i dropdownen
            select.appendChild(option); // lägger till option i select
        });

        select.addEventListener("change", (event) => {
            console.log(this.delivery); // skriver ut en tom lista

            this.delivery = {
                ...this.delivery, // tar alla värden från delivery och lägger i ett nytt objekt
                product_id: parseInt(event.target.value),
                current_stock: parseInt(event.target.selectedOptions[0].dataset.stock),
            };
            console.log(this.delivery); // skriver produktens id och lagerstatus i en lista
        });

        form.appendChild(select); // lägger till select i formuläret
        form.appendChild(submitButton); // lägger till knappen i formuläret

        this.appendChild(form); // lägger till formuläret i this (new-delivery)

        let dateLabel= document.createElement('label');

        dateLabel.textContent = "Datum för leverans";

        let dateInput = document.createElement('input'); // skapar ett input element

        dateInput.setAttribute("type", "date"); // sätter typen till date
        dateInput.setAttribute("required", "required"); // sätter attributet required
        dateInput.classList.add("date"); // style

        dateInput.addEventListener("change", (event) => {
            this.delivery = {
                ...this.delivery,
                delivery_date: event.target.value, // sparar datumet i delivery_date

            };
        });

        form.appendChild(dateLabel);
        form.appendChild(dateInput);

        // Skapar en label för antal
        let amountLabel = document.createElement('label');

        amountLabel.textContent = "Antal";

        // Skapar en input för antal
        let amountInput = document.createElement('input');

        amountInput.setAttribute("type", "number");
        amountInput.setAttribute("min", 1);
        amountInput.classList.add("amount");

        // Skapar en eventlistener för att spara antalet
        amountInput.addEventListener("change", (event) => {
            this.delivery = {
                ...this.delivery,
                amount: parseInt(event.target.value),
            };
        });

        form.appendChild(amountLabel);
        form.appendChild(amountInput);

        let commentLabel= document.createElement('label');

        commentLabel.textContent = "Leverans kommentar";

        let commentInput = document.createElement('textarea');

        commentInput.classList.add("comment"); // style
        commentInput.setAttribute("type", "text");

        commentInput.addEventListener("change", (event) => {
            this.delivery = {
                ...this.delivery,
                comment: event.target.value,
            };
        });

        form.appendChild(commentLabel);
        form.appendChild(commentInput);
    }
}
