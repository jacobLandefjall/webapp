import auth from "../models/auth.js";

export default class InvoicesView extends HTMLElement {
    // connect component
    connectedCallback() {
        if (!auth.token) {
            location.hash = "login";
        }

        this.render();
    }
    render() {
        this.innerHTML =    `<header class="header">
                                <lager-title title="Fakturor"></lager-title>
                             </header>
                             <main class="main">
                                <invoices-table></invoices-table>
                             </main>
                             `;
    }
}
