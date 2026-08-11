(() => {
    const VISIBILITY_OFFSET = 300;

    const initScrollToTop = () => {
        const button = document.querySelector('[data-scroll-to-top]');

        if (!button) {
            return;
        }

        const updateButtonVisibility = () => {
            const shouldShow = window.scrollY > VISIBILITY_OFFSET;

            button.classList.toggle('is-visible', shouldShow);
            button.setAttribute('aria-hidden', String(!shouldShow));
            button.tabIndex = shouldShow ? 0 : -1;
        };

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', updateButtonVisibility, { passive: true });
        updateButtonVisibility();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollToTop);
    } else {
        initScrollToTop();
    }
})();
