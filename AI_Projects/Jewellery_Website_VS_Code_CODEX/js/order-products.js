(() => {
    const app = window.FahadJeweller || {};

    const initOrderProducts = () => {
        const cards = app.selectAll('[data-order-product]');
        const interestField = app.select('[name="product_interest"]');

        if (!cards.length || !interestField) {
            return;
        }

        const selectedProducts = new Set();

        const updateInterestField = () => {
            interestField.value = Array.from(selectedProducts).join(', ');
            interestField.dispatchEvent(new Event('input', { bubbles: true }));
        };

        cards.forEach((card) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', 'false');

            const toggleCard = () => {
                const productName = card.dataset.productName;

                if (!productName) {
                    return;
                }

                if (selectedProducts.has(productName)) {
                    selectedProducts.delete(productName);
                    card.classList.remove('is-selected');
                    card.setAttribute('aria-pressed', 'false');
                } else {
                    selectedProducts.add(productName);
                    card.classList.add('is-selected');
                    card.setAttribute('aria-pressed', 'true');
                }

                updateInterestField();
            };

            card.addEventListener('click', toggleCard);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleCard();
                }
            });
        });
    };

    app.ready(initOrderProducts);
})();
