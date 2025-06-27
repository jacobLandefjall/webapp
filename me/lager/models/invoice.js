// invoice.js
import { apiKey, baseURL } from "../utils.js";
import auth from "./auth.js";
import orders from "./orders.js";

const invoices = {
  getInvoices: async function() {
    const response = await fetch(`${baseURL}/invoices?api_key=${apiKey}`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem("token") || ""
      },
    });
    return (await response.json()).data;
  },

  addInvoice: async function(other) {
    const tOther = new Date();
    const newDate = `${tOther.getFullYear()}-${("0" + (tOther.getMonth() + 1)).slice(-2)}-${tOther.getDate()}`;
    tOther.setDate(tOther.getDate() + 30);
    const dueDate = `${tOther.getFullYear()}-${("0" + (tOther.getMonth() + 1)).slice(-2)}-${tOther.getDate()}`;

    const authToken = localStorage.getItem('token'); // Hämta token korrekt
    if (!authToken) {
        console.error("Ingen giltig token hittades!");
        return 401;
    }

    const invoiceData = {
        due_date: dueDate,
        creation_date: newDate,
        api_key: apiKey,
        ...other
    };

    const res = await fetch(`${baseURL}/invoices`, {
        body: JSON.stringify(invoiceData),
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': authToken
        },
        method: 'POST'
    });

    if (res.status === 201) {
      const data = await res.json();
      console.log("Faktura skapad:", data);

      if (data.order_id) {
          await orders.updateOrder(data.order_id, 600);
      }
      
      return data;
    }
    
    return res.status;
  },

  showInvoices: async function() {
    try {
      const invoices = await this.getInvoices();

      const table = document.createElement('table');
      table.classList.add('table');

      // Tabell header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      ['ID', 'Order ID', 'Total Price', 'Due Date', 'Status'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Tabell body
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
  }
};

export default invoices;
