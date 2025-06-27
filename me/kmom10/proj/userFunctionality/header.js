/* This script handles the visibility of login, register, and logout links in the header 
based on the user's authentication status. */
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = !!localStorage.getItem("token");
    const email = localStorage.getItem("user_email");

    console.log("Header script loaded, isLoggedIn:", isLoggedIn, "email:", email);

    const loginLink = document.getElementById("nav-login");
    const registerLink = document.getElementById("nav-register");
    const logoutLink = document.getElementById("nav-logout");
    const userInfo = document.getElementById("user-info");

    if (isLoggedIn) {
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        logoutLink.style.display = "inline";
        userInfo.style.display = "inline";

        if (email) {
            userInfo.textContent = `Inloggad som: ${email}`;
        }
    } else {
        loginLink.style.display = "inline";
        registerLink.style.display = "inline";
        logoutLink.style.display = "none";
        userInfo.style.display = "none";
    }

    logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("api_key");
        localStorage.removeItem("user_email");

        window.location.href = "index.html";
    });
});
