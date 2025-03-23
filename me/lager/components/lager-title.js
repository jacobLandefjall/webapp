/**
 * Ärver från HTMLEIement klassen som är JS representationen av HTML elementet
 * då kan komma attribut som textContent, innerHTML
 */
export default class LagerTitle extends HTMLElement { // ärver från HTMLElement
    constructor() {
        super(); // anropa konstruktorn i HTMLElement

        this.name = "Jacob"; // skapar en egenskap name
    }

    static get observedAttributes() { // Kunna ändra på attribut
        return ["name"]; // observera name
    }

    attributeChangedCallback(property, oldValue, newValue) { // när attributet ändras
        if (oldValue === newValue) {
            return; // om det är samma värde
        }
        this[property] = newValue; // sätt nytt värde
    }


    // connect component
    connectedCallback() { // komponenten är ansluten aropas metoden
        this.innerHTML = `<h1>${this.name} 's lager-app</h1>`; // inerHTML för att få och ändra text
    }
}
