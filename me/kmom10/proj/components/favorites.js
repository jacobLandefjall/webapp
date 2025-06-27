/* Inlogged user should be able to save their favorite stations*/
function getFavoritesKey() {
    const email = localStorage.getItem("user_email");
    return `favorites_${email}`;
}

export async function setFavorites(station) {
    const key = getFavoritesKey();
    const saved = JSON.parse(localStorage.getItem(key) || "[]");

    if (!saved.find(s => s.place === station.place)) {
        saved.push(station);
        localStorage.setItem(key, JSON.stringify(saved));
    }
}

export async function getFavorites() {
    const key = getFavoritesKey();
    return JSON.parse(localStorage.getItem(key) || "[]");
}
