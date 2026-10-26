import { getCart, getCartTotal } from './cart.js';
import { getProductById, getProductImage, calculatePrice, syncLiveProducts } from './products.js';

const form = document.getElementById('checkoutForm');
if (form) {
    const panels = [...form.querySelectorAll('[data-step-panel]')];
    const stepItems = [...document.querySelectorAll('[data-step-item]')];
    const stepMessage = document.getElementById('checkoutStepMessage');
    const progress = document.getElementById('checkoutProgress');
    const nextButton = document.getElementById('checkoutNext');
    const previousButton = document.getElementById('checkoutPrevious');
    const submitButton = document.getElementById('submitBtn');
    const source = document.getElementById('checkoutDynamicFields');
    const contactFields = document.getElementById('checkoutContactFields');
    const addressFields = document.getElementById('checkoutAddressFields');
    let activeStep = 1;

    const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));

    function setStep(step) {
        activeStep = Math.max(1, Math.min(3, step));
        panels.forEach((panel) => {
            const isActive = Number(panel.dataset.stepPanel) === activeStep;
            panel.hidden = !isActive;
            panel.classList.toggle('is-active', isActive);
        });
        stepItems.forEach((item) => {
            const itemStep = Number(item.dataset.stepItem);
            const isActive = itemStep === activeStep;
            item.classList.toggle('is-active', isActive);
            item.classList.toggle('is-complete', itemStep < activeStep);
            if (isActive) item.setAttribute('aria-current', 'step');
            else item.removeAttribute('aria-current');
        });
        if (progress) progress.style.transform = `scaleX(${(activeStep - 1) / 2})`;
        if (previousButton) previousButton.hidden = activeStep === 1;
        if (nextButton) nextButton.hidden = activeStep === 3;
        if (submitButton) submitButton.hidden = activeStep !== 3;
        clearStepMessage();
        const heading = document.getElementById(`checkoutStepTitle${activeStep}`);
        heading?.setAttribute('tabindex', '-1');
        heading?.focus({ preventScroll: true });
        document.querySelector('.checkout-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function clearStepMessage() {
        if (!stepMessage) return;
        stepMessage.hidden = true;
        stepMessage.textContent = '';
    }

    function showStepMessage(message) {
        if (!stepMessage) return;
        stepMessage.textContent = message;
        stepMessage.hidden = false;
    }

    function setFieldError(input, message) {
        const wrapper = input.closest('.form-field') || input.parentElement;
        if (!wrapper) return;
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        let error = wrapper.querySelector('.checkout-field-error');
        if (!error) {
            error = document.createElement('span');
            error.className = 'checkout-field-error';
            error.setAttribute('role', 'alert');
            wrapper.append(error);
        }
        error.textContent = message;
    }

    function clearFieldError(input) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        input.closest('.form-field')?.querySelector('.checkout-field-error')?.remove();
    }

    function validateControl(input) {
        const value = input.value.trim();
        const label = input.closest('.form-field')?.querySelector('label')?.textContent?.replace('*', '').trim() || 'هذا الحقل';
        const required = input.dataset.required === 'true';
        const minLength = Number(input.dataset.min || 0);
        const pattern = input.dataset.pattern || '';
        let message = '';

        if (required && !value) message = input.dataset.err || `من فضلك أدخل ${label}.`;
        else if (value && minLength > 0 && value.length < minLength) message = input.dataset.err || `${label} يحتاج إلى ${minLength} أحرف على الأقل.`;
        else if (value && pattern) {
            try {
                if (!new RegExp(pattern).test(value)) message = input.dataset.err || `راجع صيغة ${label}.`;
            } catch (error) {
                console.warn('Checkout validation pattern is invalid:', error);
            }
        }

        if (message) setFieldError(input, message);
        else clearFieldError(input);
        return !message;
    }

    function validatePanel(step) {
        const panel = panels.find((item) => Number(item.dataset.stepPanel) === step);
        if (!panel) return true;
        let firstInvalid = null;
        panel.querySelectorAll('[data-required]').forEach((input) => {
            if (!validateControl(input) && !firstInvalid) firstInvalid = input;
        });

        if (step === 2) {
            const customSection = document.getElementById('customPrintSection');
            const customText = document.getElementById('customPrintText');
            const customImage = document.getElementById('customPrintImage');
            const customPrintActive = customSection?.style.display !== 'none';
            if (customPrintActive && customText && !customText.value.trim()) {
                setFieldError(customText, 'اكتب النص المطلوب طباعته على المنتج.');
                firstInvalid ||= customText;
            } else if (customText) {
                clearFieldError(customText);
            }
            if (customPrintActive && customImage && !customImage.files?.length) {
                setFieldError(customImage, 'ارفع صورة الشعار أو التصميم لإتمام الطباعة المخصصة.');
                firstInvalid ||= customImage;
            } else if (customImage) {
                clearFieldError(customImage);
            }
        }

        if (firstInvalid) {
            clearStepMessage();
            firstInvalid.focus({ preventScroll: true });
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    }

    function validatePaymentStep() {
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selectedPayment) {
            showStepMessage('اختر طريقة الدفع المناسبة لإكمال الطلب.');
            document.getElementById('paymentSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }

        const receiptInput = document.getElementById('receiptImage');
        if (selectedPayment.dataset.requireReceipt === 'true' && !receiptInput?.files?.length) {
            showStepMessage('ارفع صورة إيصال التحويل لإكمال الطلب بهذه الوسيلة.');
            receiptInput?.focus({ preventScroll: true });
            document.getElementById('receiptField')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        clearStepMessage();
        return true;
    }

    function validateStep(step) {
        if (step < 3) return validatePanel(step);
        return validatePaymentStep();
    }

    function moveToNextStep() {
        if (validateStep(activeStep)) setStep(activeStep + 1);
    }

    nextButton?.addEventListener('click', moveToNextStep);
    previousButton?.addEventListener('click', () => setStep(activeStep - 1));
    stepItems.forEach((item) => {
        item.querySelector('[data-step-target]')?.addEventListener('click', () => {
            const target = Number(item.dataset.stepItem);
            if (target < activeStep) setStep(target);
        });
    });

    // Keep Enter-key submissions inside the wizard until the customer reaches payment.
    form.addEventListener('submit', (event) => {
        if (activeStep < 3) {
            event.preventDefault();
            event.stopImmediatePropagation();
            moveToNextStep();
            return;
        }

        for (const step of [1, 2]) {
            if (!validatePanel(step)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                setStep(step);
                panels.find((panel) => Number(panel.dataset.stepPanel) === step)?.querySelector('.is-invalid')?.focus({ preventScroll: true });
                return;
            }
        }
        if (!validatePaymentStep()) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);

    form.addEventListener('input', (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) return;
        if (input.id === 'field_phone' || input.name === 'phone') {
            input.value = input.value
                .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
                .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776));
        }
        if (input.classList.contains('is-invalid')) clearFieldError(input);
        clearStepMessage();
    });

    form.addEventListener('change', (event) => {
        if (event.target?.id === 'customPrintImage') {
            const fileName = document.getElementById('customPrintFileName');
            fileName.textContent = event.target.files?.[0] ? `تم اختيار: ${event.target.files[0].name}` : '';
            if (event.target.files?.length) clearFieldError(event.target);
        }
    });

    function isDeliveryField(node) {
        const control = node.querySelector('input, textarea, select');
        const label = node.querySelector('label')?.textContent || '';
        const key = `${control?.id || ''} ${control?.name || ''} ${label}`.replace(/^field_/, '').toLowerCase();
        return /(city|address|street|area|district|governorate|province|location|delivery|shipping|postal|zip|building|apartment|landmark|notes|مدينة|محافظة|عنوان|توصيل|شحن|المنطقة|الشارع|ملاحظات)/i.test(key);
    }

    function distributeDynamicFields() {
        if (!source) return;
        const fields = [...source.children].filter((node) => node.querySelector?.('[id^="field_"]'));
        if (!fields.length) return;

        contactFields?.replaceChildren();
        addressFields?.replaceChildren();
        fields.forEach((field) => {
            const control = field.querySelector('input, textarea, select');
            const label = field.querySelector('label')?.textContent || '';
            const key = `${control?.id || ''} ${control?.name || ''} ${label}`.replace(/^field_/, '').toLowerCase();
            if (/(address|street|notes|landmark|building|apartment|postal|zip|عنوان|الشارع|ملاحظات|الرمز البريدي)/i.test(key)) field.classList.add('checkout-field--wide');
            (isDeliveryField(field) ? addressFields : contactFields)?.append(field);
        });
    }

    if (source && window.MutationObserver) {
        const fieldObserver = new MutationObserver((records) => {
            if (records.some((record) => record.addedNodes.length)) distributeDynamicFields();
        });
        fieldObserver.observe(source, { childList: true });
        distributeDynamicFields();
    }

    function renderOrderSummary() {
        const container = document.getElementById('checkoutSummaryItems');
        if (!container) return;
        const cart = getCart();
        container.innerHTML = cart.map((item) => {
            const product = getProductById(item.productId);
            const name = product?.name || item.productName || 'منتج K2rty';
            const image = product ? (getProductImage(item.productId, item.options) || product.defaultImage || '') : '';
            const quantity = Math.max(1, Number(item.quantity) || 1);
            const price = Number(item.price) || calculatePrice(item.productId, item.options);
            return `
                <div class="checkout-summary-item">
                    <div class="checkout-summary-thumb">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}">` : '<span aria-hidden="true">K2</span>'}</div>
                    <div class="checkout-summary-product"><strong>${escapeHtml(name)}</strong><span>الكمية: ${quantity}</span></div>
                    <strong class="checkout-summary-item-price">${escapeHtml(price * quantity)} جنيه</strong>
                </div>
            `;
        }).join('') || '<p class="checkout-summary-empty">لا توجد منتجات في السلة.</p>';

        const total = `${getCartTotal()} جنيه`;
        const stepTotal = document.getElementById('checkoutTotal');
        const asideTotal = document.getElementById('checkoutSummaryTotal');
        if (stepTotal) stepTotal.textContent = total;
        if (asideTotal) asideTotal.textContent = total;
    }

    document.addEventListener('DOMContentLoaded', async () => {
        await syncLiveProducts();
        renderOrderSummary();
        setStep(1);
    });
}
