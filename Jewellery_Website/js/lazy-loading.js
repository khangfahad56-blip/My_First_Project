(() => {
    const app = window.FahadJeweller || {};

    const initLazyLoading = () => {
        app.selectAll('img').forEach((image, index) => {
            if (!image.hasAttribute('loading')) {
                image.loading = index < 2 ? 'eager' : 'lazy';
            }

            if (!image.hasAttribute('decoding')) {
                image.decoding = 'async';
            }
        });
    };

    app.ready(initLazyLoading);
})();
