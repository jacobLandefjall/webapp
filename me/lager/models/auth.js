/**
 * JSON objekt innehåller funktioner som jobbar mot API:et.
 * Fetch funktioner för att hämta produkter och ordrar.
 * Snyggare och bättre strukturerad kod.
 */
import { apiKey, baseURL, token } from "../utils.js";

const auth = {
    get token() {
        return localStorage.getItem("token") || "";
    },

    login: async function login(username, password) {
        const user = {
            email: username,
            password: password,
            api_key: apiKey
        };

        const response = await fetch(`${baseURL}/auth/login`, {
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        });

        const result = await response.json();
        console.log("Login API-svar:", result);

        if (result?.data?.token) {
            localStorage.setItem("token", result.data.token);
            console.log("Inloggning lyckades, token sparad!");
            return "ok";
        }

        console.error("Inloggning misslyckades:", result.errors || result);
        return "not ok";
    },

    register: async function register(username, password) {
        const user = {
            email: username,
            password: password,
            api_key: apiKey
        };
    
        console.log("Skickar till API:", user);
    
        const response = await fetch(`${baseURL}/auth/register`, {
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
        });
    
        const result = await response.json();
        console.log("API-svar:", result);
    
        if (response.status === 201 && result?.data?.message === "User successfully registered.") {
            console.log("Registrering lyckades! Loggar in automatiskt...");
            return await auth.login(username, password); // Testa att logga in direkt
        }
    
        // Om API:et returnerar ett fel
        if (result.errors) {
            console.error("Registrering misslyckades:", result.errors);
            alert(`Registrering misslyckades: ${result.errors.detail || "Okänt fel"}`);
            return "not ok";
        }
    
        console.error("Registrering misslyckades: Oväntat svar", result);
        return "not ok";
    }
};

export default auth;
