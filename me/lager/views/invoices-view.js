// invoices-view.js
class InvoicesView extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      const isAuthenticated = this.checkAuthentication();
  
      if (!isAuthenticated) {
        this.shadowRoot.innerHTML = `
          <p>Du måste vara inloggad för att se denna vy.</p>
        `;
        return;
      }
  
      // Visa fakturor eller annan skyddad information här
      this.showInvoices();
    }
  
    checkAuthentication() {
      // Kontrollera om användaren är autentiserad (t.ex. genom att läsa från localStorage eller sessionStorage)
      return localStorage.getItem('userToken') !== null;
    } 
    async showInvoices() {
      const invoices = await invoices.getInvoices();
      const table = document.createElement('table');
      table.classList.add('table');
      
      // Tabellheader
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['ID', 'Order ID', 'Total Price', 'Due Date', 'Status'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
  
      // Tabellkropp
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
  
      this.shadowRoot.appendChild(table);
    }
  }

  