(() => {
    const state = {
        csrfToken: document.cookie.split('; ').find((item) => item.startsWith('csrfToken='))?.split('=')[1] || null,
        categories: [],
        products: []
    };

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    const request = async (path, options = {}) => {
        const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

        if (state.csrfToken && options.method && options.method !== 'GET') {
            headers['x-csrf-token'] = state.csrfToken;
        }

        const response = await fetch(`/api${path}`, {
            credentials: 'include',
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            }
        });
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || 'Request failed');
        }

        return payload.data ?? payload;
    };

    const toast = (message) => {
        const region = $('[data-admin-toast]');
        const item = document.createElement('div');
        item.className = 'admin-toast';
        item.textContent = message;
        region.appendChild(item);
        setTimeout(() => item.remove(), 3500);
    };

    const formDataToObject = (form) => {
        const data = Object.fromEntries(new FormData(form).entries());

        $$('input[type="checkbox"]', form).forEach((input) => {
            data[input.name] = input.checked;
        });

        return data;
    };

    const renderList = (target, items, renderer) => {
        target.innerHTML = `<div class="admin-list">${items.map(renderer).join('') || '<p>No records yet.</p>'}</div>`;
    };

    const loadDashboard = async () => {
        const data = await request('/dashboard');
        $('[data-stats]').innerHTML = Object.entries(data.stats).map(([label, value]) => `
            <div class="stat-card"><span>${label}</span><strong>${value}</strong></div>
        `).join('');
        renderList($('[data-recent-orders]'), data.recentOrders, (order) => `
            <div class="list-row"><span>${order.customer_name || 'Customer'} - ${order.selected_product || 'Custom order'}</span><strong>${order.status}</strong></div>
        `);
        renderList($('[data-recent-messages]'), data.recentMessages, (message) => `
            <div class="list-row"><span>${message.name} - ${message.subject || 'Message'}</span><strong>${message.status}</strong></div>
        `);
    };

    const loadCategories = async () => {
        state.categories = await request('/categories');
        $$('[data-category-options]').forEach((select) => {
            select.innerHTML = '<option value="">No category</option>' + state.categories.map((category) => (
                `<option value="${category.id}">${category.name}</option>`
            )).join('');
        });
        renderList($('[data-categories-list]'), state.categories, (category) => `
            <div class="list-row">
                <span>${category.name}</span>
                <span class="row-actions">
                    <button type="button" data-edit-category="${category.id}">Edit</button>
                    <button type="button" class="danger" data-delete-category="${category.id}">Delete</button>
                </span>
            </div>
        `);
    };

    const loadProducts = async () => {
        state.products = await request('/products');
        $$('[data-product-options]').forEach((select) => {
            select.innerHTML = '<option value="">No product</option>' + state.products.map((product) => (
                `<option value="${product.id}">${product.name}</option>`
            )).join('');
        });
        renderList($('[data-products-list]'), state.products, (product) => `
            <div class="list-row">
                <span>${product.name} ${product.category_name ? `(${product.category_name})` : ''}</span>
                <span class="row-actions">
                    <button type="button" data-edit-product="${product.id}">Edit</button>
                    <button type="button" class="danger" data-delete-product="${product.id}">Delete</button>
                </span>
            </div>
        `);
    };

    const loadGallery = async () => {
        const images = await request('/gallery');
        renderList($('[data-gallery-list]'), images, (image) => `
            <div class="list-row">
                <span>${image.title}</span>
                <span class="row-actions">
                    <button type="button" class="danger" data-delete-gallery="${image.id}">Delete</button>
                </span>
            </div>
        `);
    };

    const loadOrders = async () => {
        const orders = await request('/orders');
        renderList($('[data-orders-list]'), orders, (order) => `
            <div class="list-row">
                <span>${order.customer_name || 'Customer'} - ${order.selected_product || 'Custom order'}</span>
                <span class="row-actions">
                    <select data-order-status="${order.id}">
                        ${['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'].map((status) => (
                            `<option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>`
                        )).join('')}
                    </select>
                    <button type="button" class="danger" data-delete-order="${order.id}">Delete</button>
                </span>
            </div>
        `);
    };

    const loadMessages = async () => {
        const messages = await request('/messages');
        renderList($('[data-messages-list]'), messages, (message) => `
            <div class="list-row">
                <span>${message.name} - ${message.subject || message.message}</span>
                <span class="row-actions">
                    <select data-message-status="${message.id}">
                        ${['Unread', 'Read', 'Archived'].map((status) => (
                            `<option value="${status}" ${status === message.status ? 'selected' : ''}>${status}</option>`
                        )).join('')}
                    </select>
                    <button type="button" class="danger" data-delete-message="${message.id}">Delete</button>
                </span>
            </div>
        `);
    };

    const loadAll = async () => {
        await Promise.all([loadDashboard(), loadCategories(), loadProducts(), loadGallery(), loadOrders(), loadMessages()]);
    };

    const showDashboard = () => {
        $('[data-login-panel]').hidden = true;
        $('[data-dashboard-panel]').hidden = false;
    };

    $('[data-login-form]').addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = $('[data-login-message]');

        try {
            const data = await request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(formDataToObject(event.currentTarget))
            });
            state.csrfToken = data.csrfToken;
            showDashboard();
            await loadAll();
        } catch (error) {
            message.textContent = error.message;
        }
    });

    $('[data-logout]').addEventListener('click', async () => {
        await request('/auth/logout', { method: 'POST', body: JSON.stringify({}) }).catch(() => null);
        window.location.reload();
    });

    $('.admin-tabs').addEventListener('click', (event) => {
        const button = event.target.closest('[data-tab]');

        if (!button) {
            return;
        }

        $$('.admin-tabs button').forEach((tab) => tab.classList.toggle('active', tab === button));
        $$('.admin-section').forEach((section) => section.classList.toggle('active', section.dataset.section === button.dataset.tab));
    });

    $('[data-category-form]').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = formDataToObject(event.currentTarget);
        const method = data.id ? 'PUT' : 'POST';
        const path = data.id ? `/categories/${data.id}` : '/categories';
        delete data.id;
        await request(path, { method, body: JSON.stringify(data) });
        event.currentTarget.reset();
        await loadCategories();
        toast('Category saved.');
    });

    $('[data-product-form]').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = formDataToObject(event.currentTarget);
        const method = data.id ? 'PUT' : 'POST';
        const path = data.id ? `/products/${data.id}` : '/products';
        delete data.id;
        await request(path, { method, body: JSON.stringify(data) });
        event.currentTarget.reset();
        await loadProducts();
        toast('Product saved.');
    });

    $('[data-gallery-form]').addEventListener('submit', async (event) => {
        event.preventDefault();
        await request('/gallery', {
            method: 'POST',
            body: new FormData(event.currentTarget)
        });
        event.currentTarget.reset();
        await loadGallery();
        toast('Gallery image saved.');
    });

    $('[data-rates-form]').addEventListener('submit', async (event) => {
        event.preventDefault();
        await request('/rates', {
            method: 'POST',
            body: JSON.stringify(formDataToObject(event.currentTarget))
        });
        toast('Rates updated.');
    });

    $('[data-settings-form]').addEventListener('submit', async (event) => {
        event.preventDefault();
        await request('/settings', {
            method: 'PUT',
            body: JSON.stringify({ settings: formDataToObject(event.currentTarget) })
        });
        toast('Settings saved.');
    });

    document.addEventListener('click', async (event) => {
        const editCategoryId = event.target.dataset.editCategory;
        const editProductId = event.target.dataset.editProduct;
        const categoryId = event.target.dataset.deleteCategory;
        const productId = event.target.dataset.deleteProduct;
        const galleryId = event.target.dataset.deleteGallery;
        const orderId = event.target.dataset.deleteOrder;
        const messageId = event.target.dataset.deleteMessage;

        if (editCategoryId) {
            const category = state.categories.find((item) => item.id === editCategoryId);
            const form = $('[data-category-form]');
            form.id.value = category.id;
            form.name.value = category.name;
            form.sort_order.value = category.sort_order;
            form.description.value = category.description || '';
            form.is_active.checked = category.is_active;
        } else if (editProductId) {
            const product = state.products.find((item) => item.id === editProductId);
            const form = $('[data-product-form]');
            form.id.value = product.id;
            form.name.value = product.name;
            form.category_id.value = product.category_id || '';
            form.metal_type.value = product.metal_type || '';
            form.purity.value = product.purity || '';
            form.weight_grams.value = product.weight_grams || '';
            form.price_note.value = product.price_note || 'Contact for Price';
            form.description.value = product.description || '';
            form.is_available.checked = product.is_available;
            form.is_featured.checked = product.is_featured;
        } else if (categoryId) {
            await request(`/categories/${categoryId}`, { method: 'DELETE' });
            await loadCategories();
        } else if (productId) {
            await request(`/products/${productId}`, { method: 'DELETE' });
            await loadProducts();
        } else if (galleryId) {
            await request(`/gallery/${galleryId}`, { method: 'DELETE' });
            await loadGallery();
        } else if (orderId) {
            await request(`/orders/${orderId}`, { method: 'DELETE' });
            await loadOrders();
        } else if (messageId) {
            await request(`/messages/${messageId}`, { method: 'DELETE' });
            await loadMessages();
        }
    });

    document.addEventListener('change', async (event) => {
        if (event.target.dataset.orderStatus) {
            await request(`/orders/${event.target.dataset.orderStatus}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: event.target.value })
            });
            toast('Order status updated.');
        }

        if (event.target.dataset.messageStatus) {
            await request(`/messages/${event.target.dataset.messageStatus}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: event.target.value })
            });
            toast('Message status updated.');
        }
    });

    request('/auth/me')
        .then(async () => {
            showDashboard();
            await loadAll();
        })
        .catch(() => null);
})();
