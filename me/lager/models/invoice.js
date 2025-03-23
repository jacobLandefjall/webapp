import { baseURL, apiKey } from "../utils.js";
import auth from "./auth.js";
import orders from "./orders.js";

if (apiKey) {
    console.log(`API Key: ${apiKey}`);
    console.log(`Base URL: ${baseURL}`);
} else {
    console.log("API Key is not set.");
}

const invoices = {
    getInvoices: async function() {
            const response = await fetch(`${baseURL}/invoices?api_key=${apiKey}`, {
                method: 'GET',
                headers: {
                    'x-access-token': auth.token
                },
            });
            console.log(response);
            console.log(this.getInvoices);
            return (await response.json()).data;
    },
    addInvoice: async function addInvoice(other) {
        const tOther = new Date,
        newDate = ` ${tOther.getFullYear()}-${("0" + (tOther.getMonth() + 1)).slice(-2)}-${tOther.getDate()}`;
        tOther.setDate(tOther.getDate() + 30);
        const date = ` ${tOther.getFullYear()}-${("0" + (tOther.getMonth() + 1)).slice(-2)}-${tOther.getDate()}`;
        const sOther = {
            due_date: date,
            creation_date: newDate,
            apiKey: apiKey
        }
        , invoice = Object.assign(sOther, other)
        , res = await fetch(`${baseURL}/invoices`, {
            body: JSON.stringify(invoice),
            headers: {
                'content-type': 'application/json',
                'x-access-token': auth.token
            },
            method: 'POST'
        });
        return 201 === res.status && await orders.updateOrder(invoice.order_id, 600),
        res.status
    },

        showInvoices: async function() {
            try {
                const invoices = await this.getInvoices();

                const table = document.createElement('table');

                table.classList.add('table');
            
            // tabell header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            ['ID', 'Order ID', 'Total Price', 'Due Date', 'Status'].forEach(text => {
                const th = document.createElement('th');

                th.textContent = text;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // tabell body
            const tbody = document.createElement('tbody');

            invoices.forEach(invoice => {
                const row = document.createElement('tr');

                ['id', 'order_id', 'total_price', 'due_date', 'status'].forEach(key => {
                    const cell = document.createElement('td');

                    cell.textContent = invoice[key];
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            
            document.body.appendChild(table);
        } catch (error) {
            console.error('Något gick fel', error);
        }
    },
};


export default invoices;
