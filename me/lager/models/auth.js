/**
 * JSON objekt innehåller funktioner som jobbar mot API:et.
 * Fetch funktioner för att hämta produkter och ordrar.
 * Snyggare och bättre strukturerad kod.
 */
import { apiKey, baseURL, token } from "../utils.js";

const auth = {
    token: "",

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
                //"x-access-token": auth.token
            },
            method: "POST",
            });

            const result = await response.json();

            if ("errors" in result) {
                return result.errors.detail;
            } else {
                auth.token = result.data.token;
                localStorage.setItem("token", auth.token);
                console.log(auth.token);
                return "ok";
            }
    },

    register: async function register(username, password) {
        const user = {
            email: username,
            password: password,
            api_key: apiKey
        };
        console.log(user)
        const response = await fetch(`${baseURL}/auth/register`, {
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            });

            const result = await response.json();
            console.log(result);

            if (result.data.message === "User successfully registered.") {
                return "ok";
            }
            return "not ok";
    }
};

export default auth;
