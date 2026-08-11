(() => {
    const app = window.FahadJeweller || {};
    const SUCCESS_MESSAGES = {
        contact: 'Thank you. Your message is ready to send and our team will contact you soon.',
        order: 'Your order details are ready. Our team will contact you to confirm pricing and availability.'
    };

    const setLoading = (form, isLoading) => {
        const submitButton = form.querySelector('[type="submit"]');

        if (!submitButton) {
            return;
        }

        if (!submitButton.dataset.originalText) {
            submitButton.dataset.originalText = submitButton.textContent.trim();
        }

        submitButton.disabled = isLoading;
        submitButton.classList.toggle('is-loading', isLoading);
        submitButton.textContent = isLoading ? 'Please wait...' : submitButton.dataset.originalText;
    };

    const submitToApi = async (form) => {
        const endpoint = form.dataset.apiEndpoint;
        const payload = app.getFormData(form);

        if (!endpoint) {
            return { skipped: true, payload };
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Submission failed. Please try again.');
        }

        return data;
    };

    const initForms = () => {
        const forms = app.selectAll('[data-validate-form]');

        forms.forEach((form) => {
            form.addEventListener('input', (event) => {
                if (event.target.matches('input, select, textarea')) {
                    app.validation.clearFieldError(event.target);
                }
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!app.validation.validateForm(form)) {
                    app.notify({ type: 'error', message: 'Please correct the highlighted fields.' });
                    return;
                }

                setLoading(form, true);
                submitToApi(form)
                    .then((result) => {
                        form.dataset.payload = JSON.stringify(result.data || app.getFormData(form));
                        form.reset();
                        app.notify({
                            type: 'success',
                            message: SUCCESS_MESSAGES[form.dataset.formType] || 'Submitted successfully.'
                        });
                    })
                    .catch((error) => {
                        app.notify({ type: 'error', message: error.message });
                    })
                    .finally(() => {
                        setLoading(form, false);
                    });
            });
        });
    };

    app.ready(initForms);
})();
