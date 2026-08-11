(() => {
    const updateFooterYear = () => {
        const yearElements = document.querySelectorAll('[data-current-year]');
        const currentYear = new Date().getFullYear();

        yearElements.forEach((element) => {
            element.textContent = String(currentYear);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateFooterYear);
    } else {
        updateFooterYear();
    }
})();
