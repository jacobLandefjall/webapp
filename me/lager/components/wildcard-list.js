

export default class WildcardList extends HTMLElement {
    constructor() {
        super();

        this.orders = [1, 2, 3];
    }

    // connect component
    async connectedCallback() {

        this.render();
    }

    render() {
        const list = this.orders.map((order) => {

            return `<p><a href='#map/${order}'>${order}</a></p>`;
        }).join("");

        this.innerHTML = `<h2>Orderlista</h2>${list}`;
    }
}
