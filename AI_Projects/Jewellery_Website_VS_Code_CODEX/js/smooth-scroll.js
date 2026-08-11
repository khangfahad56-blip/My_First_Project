(() => {
    const app = window.FahadJeweller || {};

    const initSmoothScroll = () => {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');

            if (!link) {
                return;
            }

            const targetId = link.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', targetId);
        });
    };

    app.ready(initSmoothScroll);
})();
