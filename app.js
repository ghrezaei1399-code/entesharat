// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    if (container) {
        // هدر و منو را در ابتدای container قرار بده
        container.insertAdjacentHTML('afterbegin', Header.render());
        container.insertAdjacentHTML('afterbegin', Menu.render());
    }
});
