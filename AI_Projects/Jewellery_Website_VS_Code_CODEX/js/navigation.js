(() => {
    const initMobileNavigation = () => {
        const navbars = document.querySelectorAll('.navbar');

        navbars.forEach((navbar) => {
            const toggleButton = navbar.querySelector('.nav-toggle');
            const navMenu = navbar.querySelector('.nav-menu');

            if (!toggleButton || !navMenu) {
                return;
            }

            const closeMenu = () => {
                toggleButton.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('is-open');
            };

            toggleButton.addEventListener('click', () => {
                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

                toggleButton.setAttribute('aria-expanded', String(!isExpanded));
                navMenu.classList.toggle('is-open', !isExpanded);
            });

            navMenu.querySelectorAll('.nav-link').forEach((link) => {
                link.addEventListener('click', closeMenu);
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNavigation);
    } else {
        initMobileNavigation();
    }
})();
