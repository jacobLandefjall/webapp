import Router from "./router.js";

export default class Navigation extends HTMLElement {
    constructor() {
        super();
        this.router = new Router();
    }

    connectedCallback() {
        this.renderNavigation();
        window.addEventListener("hashchange", () => this.renderNavigation());
    }

    renderNavigation() {
        const routes = this.router.routes;
        const isAuthenticated = localStorage.getItem("token") !== null; // user is logged in
        let navigationLinks = "";

        for (let path in routes) 
            { if (routes[path].hidden) continue;

            if (path === "invoices") {
                navigationLinks += `<a href='#${isAuthenticated ? "invoices" : "login"}'>
                    ${isAuthenticated ? "Visa fakturor" : "Logga in"}
                </a>`;
            } else {
                navigationLinks += `<a href='#${path}'>${routes[path].name}</a>`;
            }
        }

        this.innerHTML = `<nav class="bottom-nav">${navigationLinks}</nav>`;
    }
}
