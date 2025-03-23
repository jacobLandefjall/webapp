import authModel from "../models/auth.js";
import { toast } from "../utils.js";

export default class LoginForm extends HTMLElement {
    constructor() {
        super();

        // skapar tomt objekt
        this.credentials = {};
    }

    async login() {
        const result = await authModel.login(
            this.credentials.username,
            this.credentials.password,
        );

        if (result === "ok") {
            console.log("Allt gick bra");
            location.hash = "invoices";
        } else {
            toast(result);
        }
    }

    async register() {
        const result = await authModel.register(
            this.credentials.username,
            this.credentials.password,
        );

        if (result === "ok") {
            console.log("Allt gick bra");
            this.login();
        } else {
            console.log("Något gick fel");
        }
    }

    connectedCallback() {
        // Kontrollera om användaren är inloggad
        /*let token = localStorage.getItem("token");

        // Hitta tabellen
        let invoicesTable = document.querySelector(".table");

        if (invoicesTable ){
            if (token) {
                invoicesTable.style.display = "table";
            } else {
                invoicesTable.style.display = "none";
            } */
        // Skapar ett formulär
        let form = document.createElement('form');

        // Addeventlistener på formuläret
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.login();
            //updateTableVisibility();
        });

        // Label för labelelement för användaren
        let usernameLabel = document.createElement('label');

        usernameLabel.classList.add('input-label');
        usernameLabel.textContent = "Användarnamn";

        let username= document.createElement('input');

        // Ger rätt tangentbord för email.
        username.setAttribute("type", "email");
        username.setAttribute("required", "required");
        username.classList.add("input");

        // Eventlistener för input elementet
        username.addEventListener("input", (event) => {
            this.credentials = {
                ...this.credentials,
                username: event.target.value,
            }
        });
        // Label för labelelement för lösenord
        let passwordLabel = document.createElement('label');

        passwordLabel.classList.add('input-label');
        passwordLabel.textContent = "Lösenord";

        let password = document.createElement('input');

        // Gömmer texten i lösenordet
        password.setAttribute("type", "password");
        password.setAttribute("required", "required");
        password.classList.add("input");

        password.addEventListener("input", (event) => {
            this.credentials = {
                ...this.credentials,
                password: event.target.value,
            }
        });

        let submitButton = document.createElement('input');

        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("value", "Logga in");
        submitButton.classList.add("button","green-button");

        let registerButton = document.createElement('input');
        registerButton.setAttribute("type", "button");
        registerButton.setAttribute("value", "Registrera");
        registerButton.classList.add("button","blue-button");

        registerButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.register();
        });


        form.appendChild(usernameLabel);
        form.appendChild(username);
        form.appendChild(passwordLabel);
        form.appendChild(password);
        form.appendChild(submitButton);
        form.appendChild(registerButton);

        this.appendChild(form);
    }
}
