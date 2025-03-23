export default class Router extends HTMLElement { // export default = kan importeres av andra filer
    constructor() { // Metod som körs när objektet skapas
        super(); // anropar konstruktorn i HTMLElement

        this.currentRoute = "";
        this.wildcard ="";
        this.allRoutes = {
            "": {
                view: "<products-view ></products-view>",
                name: "Lagerlista",
            },
            "detail": {
                view: "<detail-component class='slide-in'</detail-component>",
                name: "Detalj",
            },
            "packlist": {
                view: "<packlist-view></packlist-view>",
                name: "Plocklista",
            },
            "deliveries": {
                view: "<deliveries-view></deliveries-view>",
                name: "Inleveranser"
            },
            "deliveries-form": {
                view: "<new-delivery></new-delivery>",
                name: "Ny inleverans",
                hidden: true, // hidden = true = döljer sidan
            },
            "login": {
                view: "<login-view></login-view>",
                name: "Logga in",
                hidden: true,
            },
            "invoices": {
                view: "<invoices-view></invoices-view>",
                name: "Fakturor"
            },
            "new-invoice": {
                view: "<new-invoice></new-invoice>",
                name: "Ny faktura",
                hidden: true
            },
            "orders": {
                view: "<orders-view></orders-view>",
                name: "Packade ordrar",
            },
            "map": {
                view: "<map-view order=$wildcard></map-view>",
                name: "Karta",
                hidden: true,
            },
            "chat": {
                view: "<chat-form></chat-form>",
                name: "Chatt",
            }
        };
    }

    get routes() {
        return this.allRoutes;
    }

    // connect component
    connectedCallback() { // addEvebtListner = lyssnar efter en händelse
        window.addEventListener('hashchange', () => {
            this.resolveRoute(); // Lyckas det så anropas resolveRoute
        });

        this.resolveRoute();
    }

    resolveRoute() { // metoden plockar ut hashen från URL:en
        let cleanHash = location.hash.replace("#", "");

        this.wildcard = "";

        if (cleanHash.indexOf("/") > -1) {
            let splittedHash = cleanHash.split("/");

            cleanHash = splittedHash[0];
            this.wildcard = splittedHash[1];
        }

        this.currentRoute = cleanHash;
        this.render();
    }

    render() {
        let html = "<not-found></not-found>";

        if (this.routes[this.currentRoute]) {
            html = this.routes[this.currentRoute].view;

            if (this.wildcard) {
                html = html.replace("$wildcard", this.wildcard);
            }
            console.log(html);
        }


        this.innerHTML = html;
    }
}
