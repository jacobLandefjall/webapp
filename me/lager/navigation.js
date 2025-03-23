/**
 * Skapas en instans av klassen Router
 * Itererar över de och ritar ut menyn i ett nav-element
 */
import Router from "./router.js";

export default class Navigation extends HTMLElement {
    constructor() {
        super();

        this.router = new Router();
    }

    // connect component
    connectedCallback() {
        const routes = this.router.routes;

        let navigationLinks = "";

        for (let path in routes) {
            if (routes[path].hidden) {
                continue;
            }
            navigationLinks += `<a href='#${path}'>${routes[path].name}</a>`;
        }

        this.innerHTML = `<nav class="bottom-nav">${navigationLinks}</nav>`;
    }
}
