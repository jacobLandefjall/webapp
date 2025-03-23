
export default class LoginView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <lager-title title="Login"></lager-title>
                             </header>
                             <main class="main">
                                <login-form></login-form>
                             </main>
                             `;
    }
}
