(() => {
    const app = window.FahadJeweller || {};

    const PATTERNS = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^(\+92|0092|92|0)?3\d{9}$/
    };

    const messages = {
        required: 'This field is required.',
        email: 'Please enter a valid email address.',
        phone: 'Please enter a valid Pakistani mobile number.',
        checked: 'Please confirm this option.',
        futureDate: 'Please choose today or a future date.',
        deliveryAddress: 'Delivery address is required for home delivery.'
    };

    const getFieldValue = (field) => String(field.value || '').trim();

    const getErrorElement = (field) => {
        const group = field.closest('.form-group') || field.parentElement;
        let error = group.querySelector('.field-error');

        if (!error) {
            error = document.createElement('p');
            error.className = 'field-error';
            group.appendChild(error);
        }

        return error;
    };

    const setFieldError = (field, message) => {
        const error = getErrorElement(field);
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');

        if (!field.id) {
            field.id = `${field.name || 'field'}-${Date.now()}`;
        }

        const errorId = `${field.id}-error`;
        error.id = errorId;
        error.textContent = message;
        field.setAttribute('aria-describedby', errorId);
    };

    const clearFieldError = (field) => {
        const error = (field.closest('.form-group') || field.parentElement).querySelector('.field-error');
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');

        if (error) {
            error.textContent = '';
        }
    };

    const validateField = (field) => {
        clearFieldError(field);

        if (field.required && field.type === 'checkbox' && !field.checked) {
            setFieldError(field, messages.checked);
            return false;
        }

        if (field.required && field.type === 'radio') {
            const group = field.form.querySelectorAll(`[name="${field.name}"]`);
            const isChecked = Array.from(group).some((item) => item.checked);

            if (!isChecked) {
                setFieldError(field, messages.checked);
                return false;
            }
        }

        const value = getFieldValue(field);

        if (field.required && !value && field.type !== 'checkbox' && field.type !== 'radio') {
            setFieldError(field, messages.required);
            return false;
        }

        if (value && field.type === 'email' && !PATTERNS.email.test(value)) {
            setFieldError(field, messages.email);
            return false;
        }

        if (value && field.type === 'tel' && !PATTERNS.phone.test(value.replace(/[\s-]/g, ''))) {
            setFieldError(field, messages.phone);
            return false;
        }

        if (value && field.type === 'date') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (new Date(value) < today) {
                setFieldError(field, messages.futureDate);
                return false;
            }
        }

        return true;
    };

    const validateDeliveryAddress = (form) => {
        const homeDelivery = form.querySelector('[name="delivery_preference"][value="home-delivery"]');
        const address = form.querySelector('[name="address"]');

        if (!homeDelivery || !address || !homeDelivery.checked) {
            return true;
        }

        clearFieldError(address);

        if (!getFieldValue(address)) {
            setFieldError(address, messages.deliveryAddress);
            return false;
        }

        return true;
    };

    app.validation = {
        validateField,
        validateForm(form) {
            const fields = app.selectAll('input, select, textarea', form);
            const validFields = fields.map(validateField);
            const validDelivery = validateDeliveryAddress(form);
            const firstInvalid = form.querySelector('.is-invalid');

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return validFields.every(Boolean) && validDelivery;
        },
        clearFieldError
    };

    window.FahadJeweller = app;
})();
