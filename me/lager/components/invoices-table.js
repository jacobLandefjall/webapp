import invoices from '../models/invoice.js';

export default class InvoicesTable extends HTMLElement {
    constructor() {
        super();
        this.invoices = [];
    }

    async connectedCallback() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.innerHTML = "<p>Du måste vara inloggad för att se fakturor.</p>";
            return;
        }

        try {
            // Hämtar fakturorna från modellen
            this.invoices = await invoices.getInvoices();
            console.log('Fakturor:', this.invoices);
            this.render();
        } catch (error) {
            console.error('Fel vid hämtning av fakturor:', error);
            this.innerHTML = "<p>Kunde inte hämta fakturorna. Försök igen senare.</p>";
        }
    }

    render() {
        if (!this.invoices || this.invoices.length === 0) {
            this.innerHTML = "<p>Inga fakturor tillgängliga.</p>";
            return;
        }

        // Rendera tabellen med fakturor
        const invoiceList = this.invoices.map(invoice => `
            <tr>
                <td>${invoice.name}</td>
                <td>${invoice.total_price}</td>
                <td>${invoice.due_date}</td>
            </tr>
        `).join('');

        this.innerHTML = `
            <table class="table invoice">
                <thead>
                    <tr>
                        <th>Namn</th>
                        <th>Pris</th>
                        <th>Datum</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceList}
                </tbody>
            </table>
            <a href='#new-invoice' class="button blue-button">Ny faktura</a>
        `;
    }
}
