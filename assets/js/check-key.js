function checkKey() {
    const cart = JSON.parse(localStorage.getItem('globalCart')) || [];
    const hasLuminaire = cart.some(item => item.name && item.name.includes("Luminaire"));
    const currentPage = window.location.pathname.split('/').pop();
    if (hasLuminaire) {
        if (currentPage !== 'secret-menu.html') {
            window.location.href = 'secret-menu.html';
        }
    } else {
        if (currentPage === 'secret-menu.html') {
            window.location.href = 'pillow-limited.html';
        }
    }
}