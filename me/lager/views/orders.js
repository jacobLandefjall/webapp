export default class OrdersView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <lager-title title="Packade ordrar"></lager-title>
                             </header>
                             <div class="moveFromRight">
                             <main class="main">
                                <wildcard-list status=packad></wildcard-list>
                             </main>
                             </div>
                             `;
    }
}
