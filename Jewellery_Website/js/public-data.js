(() => {
    const app = window.FahadJeweller || {};

    const fetchJson = async (endpoint) => {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error('Public API request failed');
        }

        return response.json();
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === '') {
            return '';
        }

        return `Rs. ${Number(value).toLocaleString('en-PK')}`;
    };

    const updateRates = async () => {
        const rateFields = app.selectAll('[data-rate-field]');

        if (!rateFields.length) {
            return;
        }

        const payload = await fetchJson('/api/rates/latest').catch(() => null);
        const rates = payload?.data;

        if (!rates) {
            return;
        }

        rateFields.forEach((field) => {
            const key = field.dataset.rateField;
            field.textContent = formatCurrency(rates[key]);
        });

        const dateField = app.select('[data-rate-updated]');

        if (dateField) {
            dateField.textContent = new Date(rates.updated_at).toLocaleString('en-PK', {
                dateStyle: 'full',
                timeStyle: 'short'
            });
        }
    };

    const galleryItemTemplate = (image) => `
        <div class="gallery-item" data-gallery-item data-product-category="${image.category_slug || 'gallery'}" data-product-name="${image.title}" data-product-metal="${image.product_name || ''}">
            <div class="gallery-image-wrapper">
                <img src="${image.image_url}" alt="${image.alt_text}" class="gallery-img" data-lightbox-image>
                <div class="gallery-overlay">
                    <span class="overlay-text">View Details</span>
                </div>
            </div>
            <div class="gallery-info">
                <h3>${image.title}</h3>
                <p class="gallery-metal">${image.product_name || image.category_name || 'Fahad Jeweller Collection'}</p>
                <p class="gallery-price">Contact for Price</p>
            </div>
        </div>
    `;

    const updateGallery = async () => {
        const gallerySections = app.selectAll('.gallery-category[id]');

        if (!gallerySections.length) {
            return;
        }

        const payload = await fetchJson('/api/gallery').catch(() => null);
        const images = payload?.data || [];

        if (!images.length) {
            return;
        }

        gallerySections.forEach((section) => {
            const grid = app.select('.gallery-grid', section);
            const matchingImages = images.filter((image) => image.category_slug === section.id);

            if (grid && matchingImages.length) {
                grid.innerHTML = matchingImages.map(galleryItemTemplate).join('');
            }
        });

        document.dispatchEvent(new CustomEvent('fahad:gallery-updated'));
    };

    app.ready(() => {
        updateRates();
        updateGallery();
    });
})();
