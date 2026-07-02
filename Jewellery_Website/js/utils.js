(() => {
    const app = window.FahadJeweller || {};

    app.ready = (callback) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }

        callback();
    };

    app.select = (selector, context = document) => context.querySelector(selector);
    app.selectAll = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    app.normalizeText = (value) => String(value || '').trim().toLowerCase();

    app.debounce = (callback, delay = 150) => {
        let timeoutId;

        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => callback(...args), delay);
        };
    };

    app.getFormData = (form) => Object.fromEntries(new FormData(form).entries());

    window.FahadJeweller = app;
})();
