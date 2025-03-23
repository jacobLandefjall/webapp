import invoices from '../models/invoice.js';

export default class InvoicesTable extends HTMLElement {
    constructor() {
        super();
        this.invoices = [];
    }

    async connectedCallback() {
        this.invoices = await invoices.getInvoices();
        console.log('Fakturor'.this.invoices);

        this.render();
    }

    render() {
        const invoiceList = this.invoices.map(invoiceList => `<tr>\n<td>${invoiceList.name}</td>\n
            <td>${invoiceList.total_price}</td>\n
            <td>${invoiceList.due_date}</tr>`).join('');
        this.innerHTML = `<table class="table invoice'>\n
        <thead><th>Namn<th>\n
        <th>Pris</th>\n
        <th>Datum</th><thead>
        <a href='#new-invoice' class="button blue-button">Ny faktura</a>`
    }
}


