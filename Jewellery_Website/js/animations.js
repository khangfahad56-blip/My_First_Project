(() => {
    const app = window.FahadJeweller || {};

    const initAnimations = () => {
        const targets = app.selectAll('main section, .product-card, .gallery-item, .order-product-card, .contact-info-card');

        if (!('IntersectionObserver' in window)) {
            targets.forEach((target) => target.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        targets.forEach((target) => {
            target.classList.add('fade-in');
            observer.observe(target);
        });
    };

    app.ready(initAnimations);
})();
