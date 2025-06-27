import { api_key } from "../utils.js";

/* Requirement to login user */
export async function loginUser(email, password) {
    const response = await fetch("https://auth.emilfolino.se/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: api_key,
            email,
            password
        })
    });

    const data = await response.json();
    console.log("Login response data:", data);

   if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("api_key", data.data.user.api_key);
        localStorage.setItem("user_email", email);

        alert("Inloggning lyckades!");
        window.location.href = "index.html";
    } else {
        alert("Inloggning misslyckades: " + data.errors?.detail);
    }
}