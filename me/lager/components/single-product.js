export default class singleProduct extends HTMLElement {
    // component attributes
    static get observedAttributes() {
        return ['product'];
    }

    get product() {
        return JSON.parse(this.getAttribute("product"));
    }
    // connect component
    connectedCallback() {
        const product = this.product;

        this.innerHTML = `
        <div class="delivery-item">
            <span class="name">Namn: ${product.name}</span>
            <span class="stock">Lagersaldo: ${product.stock}</span>
            <span class="location">Hylla: ${product.location}</span>
        </div>
    `;
    }
}
