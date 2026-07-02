(() => {
    const getCurrentPage = () => {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);

        return page || 'index.html';
    };

    const setActiveNavigation = () => {
        const currentPage = getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const linkPage = href ? href.split('#')[0] : '';
            const isActive = linkPage === currentPage || (currentPage === 'index.html' && linkPage === '');

            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setActiveNavigation);
    } else {
        setActiveNavigation();
    }
})();
