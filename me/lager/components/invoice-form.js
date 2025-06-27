import invoices from "../models/invoice.js";
import orders from "../models/orders.js";
import { apiKey } from "../utils.js"; 

export default class InvoiceForm extends HTMLElement {
    constructor() {
        super();
        this.invoice = {};
        this.orders = [];
    }

    async addInvoice() {
        const authToken = localStorage.getItem('token'); 
        if (!authToken) {
            alert("Du måste vara inloggad för att skapa en faktura!");
            location.hash = "login";  
            return;
        }
    
        // Se till att api_key inkluderas
        this.invoice = {
            ...this.invoice,
            api_key: apiKey
        };
    
        try {
            const res = await invoices.addInvoice(this.invoice);
            
            console.log("Invoice creation response:", res);
            
            location.hash = "invoices";
            return;
        } catch (error) {
            console.error('Error in addInvoice method:', error);
        }
    }

    async connectedCallback() {
        this.orders = await orders.getOrders();
        this.orders = this.orders.filter(order => order.status_id < 600);
        console.log("Filtered Orders:", this.orders);
        this.render();
    }

    render() {
        let form = document.createElement("form");
        form.addEventListener("submit", event => {
            event.preventDefault();
            if (!this.invoice.order_id || this.invoice.order_id < 0) {
                alert("Du måste välja en giltig order!");
                return;
            }
            this.addInvoice();
        });

        let labelOrder = document.createElement("label");
        labelOrder.classList.add("input-label");
        labelOrder.textContent = "Order";

        let selectOrder = document.createElement("select");
        selectOrder.setAttribute("required", "required");
        selectOrder.classList.add("input");

        let defaultOption = document.createElement("option");
        defaultOption.setAttribute("value", -99);
        defaultOption.textContent = "Välj order";
        selectOrder.appendChild(defaultOption);

        this.orders.forEach(order => {
            let option = document.createElement("option");
            option.setAttribute("value", order.id);
            option.dataset.total_price = order.order_items.reduce((total, item) => total + item.price * item.amount, 0);
            option.textContent = `${order.name} (${order.id})`;
            selectOrder.appendChild(option);
        });

        selectOrder.addEventListener("change", event => {
            console.log("Selected Order ID:", event.target.value);
            this.invoice = {
                ...this.invoice,
                order_id: parseInt(event.target.value),
                total_price: parseFloat(event.target.selectedOptions[0].dataset.total_price)
            };
        });

        let submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("value", "Skapa faktura");
        submitButton.classList.add("button", "blue-button");

        form.appendChild(labelOrder);
        form.appendChild(selectOrder);
        form.appendChild(submitButton);
        this.appendChild(form);
    }
};
