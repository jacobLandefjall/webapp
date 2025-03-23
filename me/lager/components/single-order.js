import { apiKey, baseURL } from "../utils.js";

export default class singleOrder extends HTMLElement {
    constructor() {
        super();
        this.productsAvailable = true;
    }

    // component attributes
    static get observedAttributes() {
        return ['order'];
    }

    get order() {
        return JSON.parse(this.getAttribute("order"));
    }

    async checkProducts() {
        for (const item of this.order.order_items) {
            const response = await fetch(`
            ${baseURL}/products/${item.product_id}?api_key=${apiKey}`);
            const result = await response.json();

            if (result.data.stock < item.amount) {
                this.productsAvailable = false;
                break;
            }
        }
    }

    async updateStock(productId, amount) {
        // Verifiera product_id och amount
        console.log(`produktID: ${productId} mängd: ${amount}`);

        if (productId == null || amount == null) {
            console.error("ProduktID eller mängd saknas");
            return; // Avbryter funktionen
        }

        const response = await fetch(`${baseURL}/products/${productId}?api_key=${apiKey}`);
        const product = await response.json();

        if (!response.ok) {
            console.error("Kunde inte hämta produkt", product);
            return;
        }

        const newStock = product.data.stock - amount;
        const productName = product.data.name;

        // Skickar uppdatering
        const updateRes = await fetch(`${baseURL}/products`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: productId,
                name: productName,
                stock: newStock,
                api_key: apiKey
            })
        });

        if (updateRes.ok) {
            console.log(`ProduktID: ${productId} har uppdaterats`);
        } else {
            const errorRes = await updateRes.json();

            console.log("Misslyckades att uppdatera", errorRes);
        }
    }


    async packOrder(order) {
        for (const item of order.order_items) {
            await this.updateStock(item.product_id, item.amount);
        }
        // Uppdatera stock antal för varje produkt (order_item)

        // om gick bra att uppdatera produkter
        // Uppatera order status
        let orderData = {
            id: order.id,
            name: order.name,
            status_id: 200,
            api_key: apiKey
        };

        const response = await fetch(`${baseURL}/orders`, {
            body: JSON.stringify(orderData),
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT"
        });

        if (response.ok) {
            console.log("Order packad");
            this.remove();
        } else {
            console.error("Misslyckades att packa");
        }
    }

    // connect component
    async connectedCallback() {
        await this.checkProducts();

        let container = document.createElement("div"); // Skapar ett "div" element

        container.className = "container"; // Lägger till en klass "container" för styling

        const orderItems = this.order.order_items.map((item) => { // Loppar igenom alla order_items
            // Kolla om stock < amount
            return `
                <div class="delivery-item">
                    <span>Produkt: ${item.name}</span>
                    <span>Antal: ${item.amount}</span>
                    <span>Hyllplats: ${item.location}</span>
                </div>
                `;  // Skapar en div för varje order_item
        }).join(""); // Gör om arrayen till en sträng

        container.innerHTML = `<h3>${this.order.name}<h3>${orderItems}`;


        if (this.productsAvailable) { // Om alla produkter finns, lägg till "Packa order"
            let button = document.createElement("button");

            button.textContent = "Packa order";
            button.className = "pack-button";
            button.addEventListener("click", () => {
                this.packOrder(this.order);
            });
            container.appendChild(button);//Lägger till knappen endast om alla produkter finns
        }

        this.appendChild(container);
    }
}
