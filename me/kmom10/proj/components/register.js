import { api_key } from "../utils.js";
import { loginUser } from "./login.js";

export async function registerUser(email, password) {
    const user = {
            email: email,
            password: password,
            api_key: api_key
        };

        const response = await fetch("https://auth.emilfolino.se/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    console.log("Server response:", response);

    const data = await response.json();
    console.log("Server response:", data);

    if (response.ok) {
        alert("Användaren skapades! Loggar in...");

        await loginUser(email, password);

        window.location.href = "index.html";
    } else {
        alert("Registrering misslyckades: " + data.errors?.detail);
    }
}
