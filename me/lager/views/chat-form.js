export default class ChatFormView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <lager-title title="Chatt"></lager-title>
                             </header>
                             <main class="main chat-view">
                                <chat-form></chat-form>
                             </main>
                             `;
    }
}
