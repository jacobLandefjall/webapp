import invoices from "../models/invoice";
import orders from "../models/orders";

export default class InvoiceForm extends HTMLElement {
    constructor() {
        super();
        this.invoice = {};
        this.orders = [];
    }
    async addInvoice() {
        201 === await invoices.addInvoice(this.invoice) && (location.hash = "invoices")
    }
    async connectedCallback() {
        this.orders = await orders.getOrders();
        this.orders = this.orders.filter(other => other.status_id < 600),
        this.render()
    }
    render() {
        let other = document.createElement("form");
        other.addEventListener("submit", other => {
            other.preventDefault(),
            this.invoice.order_id > 0 && this.addInvoice()
        });

        let tOrder = document.createElement("label");

        tOrder.classList.add("input-label"),
        tOrder.textContent = "Order";
        let sOrder = document.createElement("select");

        sOrder.setAttribute("required", "required"),
        sOrder.classList.add("input");
        let optionOrder = document.createElement("option");

        optionOrder.setAttribute("value", -99),
        optionOrder.textContent = "Välj order",
        sOrder.appendChild(optionOrder),
        this.orders.forEach(other => {
            let tOrder = document.createElement("option");
            option.setAttribute("value", other.id),
            tOrder.dataset.total_price = other.order_items.reduce((other, tOrder)=> other + tOrder.price * tOrder.amount, 0),
            tOrder.textContent = `${other.name} (${other.id})`,
            sOrder.appendChild(tOrder)
        }),
        sOrder.addEventListener("change", other=> {
            this.invoice = {
                ...this.invoice,
                order_id: parseInt(other.target.value),
                total_price: parseFloat(other.target.selectedOptions[0].dataset.total_price)
            }
        });
        let input = document.createElement("input");

        input.setAttribute("type", "submit"),
        input.setAttribute("value", "Skapa faktura"),
        input.classList.add("button", "blue-button"),
        other.appendChild(tOrder),
        other.appendChild(sOrder),
        other.appendChild(input),
        this.appendChild(other)
    }
};
