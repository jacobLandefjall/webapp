export default class ChatFormView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <lager-title title="Inleveranser"></lager-title>
                             </header>
                             <main class="main">
                                <chat-form></chat-form>
                             </main>
                             `;
    }
}
