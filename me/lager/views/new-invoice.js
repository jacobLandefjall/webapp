export default class NewInvoiceView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <lager-title title="Ny Faktura"></lager-title>
                             </header>
                             <main class="main">
                                <invoice-form></invoice-form>
                             </main>
                             `;
    }
}