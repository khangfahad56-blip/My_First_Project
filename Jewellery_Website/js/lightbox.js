(() => {
    const app = window.FahadJeweller || {};
    const state = {
        lightbox: null,
        image: null,
        caption: null,
        closeButton: null,
        activeIndex: 0,
        activeTrigger: null
    };

    const getImages = () => app.selectAll('[data-lightbox-image]');

    const showImage = (index) => {
        const images = getImages();

        if (!images.length) {
            return;
        }

        state.activeIndex = (index + images.length) % images.length;
        const image = images[state.activeIndex];
        state.image.src = image.currentSrc || image.src;
        state.image.alt = image.alt;
        state.caption.textContent = image.alt;
    };

    const openLightbox = (image) => {
        state.activeTrigger = document.activeElement;
        state.activeIndex = getImages().indexOf(image);
        showImage(state.activeIndex);
        state.lightbox.classList.add('is-open');
        state.lightbox.setAttribute('aria-hidden', 'false');
        state.closeButton.focus();
    };

    const closeLightbox = () => {
        state.lightbox.classList.remove('is-open');
        state.lightbox.setAttribute('aria-hidden', 'true');

        if (state.activeTrigger && typeof state.activeTrigger.focus === 'function') {
            state.activeTrigger.focus();
        }
    };

    const prepareTriggers = () => {
        getImages().forEach((image) => {
            const trigger = image.closest('.gallery-image-wrapper') || image;

            if (trigger.dataset.lightboxReady) {
                return;
            }

            trigger.setAttribute('tabindex', '0');
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('aria-label', `Preview ${image.alt}`);
            trigger.addEventListener('click', () => openLightbox(image));
            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(image);
                }
            });
            trigger.dataset.lightboxReady = 'true';
        });
    };

    const createLightbox = () => {
        if (state.lightbox || !getImages().length) {
            return;
        }

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('data-lightbox', '');
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image preview');
        lightbox.innerHTML = `
            <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
            <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">&#8249;</button>
            <img class="lightbox-img" alt="">
            <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">&#8250;</button>
            <p class="lightbox-caption"></p>
        `;
        document.body.appendChild(lightbox);

        state.lightbox = lightbox;
        state.image = app.select('.lightbox-img', lightbox);
        state.caption = app.select('.lightbox-caption', lightbox);
        state.closeButton = app.select('.lightbox-close', lightbox);

        state.closeButton.addEventListener('click', closeLightbox);
        app.select('.lightbox-prev', lightbox).addEventListener('click', () => showImage(state.activeIndex - 1));
        app.select('.lightbox-next', lightbox).addEventListener('click', () => showImage(state.activeIndex + 1));
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (!lightbox.classList.contains('is-open')) {
                return;
            }

            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                showImage(state.activeIndex - 1);
            } else if (event.key === 'ArrowRight') {
                showImage(state.activeIndex + 1);
            }
        });
    };

    const initLightbox = () => {
        createLightbox();
        prepareTriggers();
    };

    app.initLightbox = initLightbox;
    app.ready(initLightbox);
    document.addEventListener('fahad:gallery-updated', initLightbox);
})();
