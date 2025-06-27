
async function loadHTML(url, elementId) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Kunde inte ladda ${url}: ${error}`);
    }
}

// Ladda header och footer när sidan laddar
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('./templates/header.html', 'header').then(() => {
        // Load header specific scripts
        const hamburger = document.querySelector('.hamburger');
        const navbarLinks = document.querySelector('.navbar-links');

        if (hamburger && navbarLinks) {
            hamburger.addEventListener('click', () => {
                navbarLinks.classList.toggle('show');

                // Change between hamburger and close icon
                if (navbarLinks.classList.contains('show')) {
                    hamburger.innerHTML = '&times;'; // Close icon
                } else {
                    hamburger.innerHTML = '&#x2630;'; // Hamburger icon
                }
            });
        }
        // Check if user is logged in
    const headerScript = document.createElement('script');
        headerScript.type = 'module';
        headerScript.src = './userFunctionality/header.js';
        document.body.appendChild(headerScript);

        // ✅ Ladda delays.js EFTER att header + main finns i DOM
        const delaysScript = document.createElement('script');
        delaysScript.type = 'module';
        delaysScript.src = './components/delays.js';
        document.body.appendChild(delaysScript);
    });
});