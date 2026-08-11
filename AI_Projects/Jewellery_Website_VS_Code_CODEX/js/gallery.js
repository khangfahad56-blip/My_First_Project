(() => {
    const app = window.FahadJeweller || {};

    const initGalleryFilters = () => {
        const controls = app.select('[data-gallery-controls]');
        const galleryItems = app.selectAll('[data-gallery-item]');

        if (!controls || galleryItems.length === 0) {
            return;
        }

        const searchInput = app.select('[data-gallery-search]', controls);
        const categorySelect = app.select('[data-gallery-category-filter]', controls);
        const clearButton = app.select('[data-gallery-clear]', controls);
        const resultText = app.select('[data-gallery-results]', controls);

        const applyFilters = () => {
            const query = app.normalizeText(searchInput.value);
            const category = categorySelect.value;
            let visibleCount = 0;

            galleryItems.forEach((item) => {
                const productName = item.dataset.productName || app.select('h3', item)?.textContent || '';
                const productMetal = item.dataset.productMetal || app.select('.gallery-metal', item)?.textContent || '';
                const text = app.normalizeText(`${productName} ${productMetal} ${item.dataset.productCategory}`);
                const matchesQuery = !query || text.includes(query);
                const matchesCategory = category === 'all' || item.dataset.productCategory === category;
                const isVisible = matchesQuery && matchesCategory;

                item.hidden = !isVisible;
                visibleCount += isVisible ? 1 : 0;
            });

            resultText.textContent = `${visibleCount} item${visibleCount === 1 ? '' : 's'} found`;
        };

        if (!controls.dataset.galleryReady) {
            searchInput.addEventListener('input', app.debounce(applyFilters, 120));
            categorySelect.addEventListener('change', applyFilters);
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                categorySelect.value = 'all';
                applyFilters();
                searchInput.focus();
            });
            controls.dataset.galleryReady = 'true';
        }

        clearButton.onclick = () => {
            searchInput.value = '';
            categorySelect.value = 'all';
            applyFilters();
            searchInput.focus();
        };

        applyFilters();
    };

    app.initGalleryFilters = initGalleryFilters;
    app.ready(initGalleryFilters);
    document.addEventListener('fahad:gallery-updated', initGalleryFilters);
})();
