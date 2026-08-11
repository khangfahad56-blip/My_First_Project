(() => {
    const app = window.FahadJeweller || {};
    const DEFAULT_DURATION = 4200;
    const TYPES = ['success', 'error', 'warning', 'info'];

    const ensureContainer = () => {
        let container = document.querySelector('[data-toast-container]');

        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.setAttribute('data-toast-container', '');
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }

        return container;
    };

    app.notify = ({ type = 'info', message, duration = DEFAULT_DURATION }) => {
        if (!message) {
            return null;
        }

        const toastType = TYPES.includes(type) ? type : 'info';
        const toast = document.createElement('div');
        toast.className = `toast toast-${toastType}`;
        toast.setAttribute('role', toastType === 'error' ? 'alert' : 'status');
        toast.textContent = message;

        ensureContainer().appendChild(toast);

        window.setTimeout(() => {
            toast.classList.add('is-leaving');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);

        return toast;
    };

    window.FahadJeweller = app;
})();
