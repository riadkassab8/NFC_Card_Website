import { getCart, getCartTotal, clearCart } from './cart.js';
import { createOrder, submitOrder } from './orderService.js';
import { getCachedCms, fetchLiveCms } from './cms.js';

const FALLBACK_FIELDS = [
    {
        id: 'name',
        label: 'الاسم الكامل',
        placeholder: 'الاسم ثلاثي',
        type: 'text',
        required: true,
        minLength: 3,
        pattern: '^[\\u0600-\\u06FFa-zA-Z\\s]{3,50}$',
        errorMessage: 'يرجى إدخال اسم ثلاثي صحيح لا يقل عن 3 أحرف وبدون رموز خاصة.',
        order: 1
    },
    {
        id: 'phone',
        label: 'رقم الهاتف (واتساب)',
        placeholder: '01xxxxxxxxx',
        type: 'tel',
        required: true,
        minLength: 11,
        pattern: '^01[0125][0-9]{8}$',
        errorMessage: 'يرجى إدخال رقم هاتف واتساب مصري صحيح مكون من 11 رقماً ويبدأ بـ 01.',
        order: 2
    },
    {
        id: 'city',
        label: 'المدينة / المحافظة',
        placeholder: 'مثال: القاهرة، الجيزة، الإسكندرية...',
        type: 'text',
        required: true,
        minLength: 2,
        pattern: '^[\\u0600-\\u06FFa-zA-Z\\s]{2,40}$',
        errorMessage: 'يرجى تحديد المدينة أو المحافظة التابع لها التوصيل.',
        order: 3
    },
    {
        id: 'address',
        label: 'العنوان بالتفصيل',
        placeholder: 'الشارع، رقم العمارة، رقم الشقة أو علامة مميزة',
        type: 'text',
        required: true,
        minLength: 6,
        pattern: '',
        errorMessage: 'يرجى كتابة عنوان التوصيل بالتفصيل لتسهيل وصول مندوب الشحن.',
        order: 4
    },
    {
        id: 'notes',
        label: 'ملاحظات إضافية (اختياري)',
        placeholder: 'أي مواعيد مفضلة للتسليم أو تفاصيل خاصة...',
        type: 'textarea',
        required: false,
        minLength: 0,
        pattern: '',
        errorMessage: '',
        order: 5
    }
];

const FALLBACK_PAYMENTS = [
    {
        id: 'cod',
        label: 'الدفع عند الاستلام',
        description: 'ادفع نقداً عند استلام طلبك ومراجعته مع مندوب الشحن',
        walletNumber: '',
        requireReceipt: false,
        enabled: true
    },
    {
        id: 'instapay',
        label: 'إنستا باي (InstaPay)',
        description: 'تحويل فوري عبر تطبيق إنستا باي',
        walletNumber: '201098277229',
        requireReceipt: true,
        enabled: true
    },
    {
        id: 'vodafone_cash',
        label: 'فودافون كاش (Vodafone Cash)',
        description: 'تحويل عبر محفظة فودافون كاش',
        walletNumber: '201098277229',
        requireReceipt: true,
        enabled: true
    }
];

function showSwalAlert(icon, title, text) {
    if (window.Swal) {
        return window.Swal.fire({
            icon,
            title,
            text,
            confirmButtonText: 'حسناً، فهمت',
            confirmButtonColor: '#0284c7',
            customClass: {
                popup: 'swal2-rtl'
            }
        });
    }
    alert(`${title}\n${text}`);
    return Promise.resolve();
}

document.addEventListener('DOMContentLoaded', async () => {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const totalEl = document.getElementById('checkoutTotal');
    if (totalEl) {
        totalEl.textContent = `${getCartTotal()} جنيه`;
    }

    // 1. Get CMS content (cache first, then live update)
    let cms = getCachedCms();
    renderDynamicForm(cms);

    // Fetch fresh CMS in background and re-render if updated
    fetchLiveCms().then(freshCms => {
        if (freshCms) {
            renderDynamicForm(freshCms);
        }
    });

    // 2. Mobile nav toggle
    document.getElementById('navToggle')?.addEventListener('click', () => {
        document.getElementById('navLinks')?.classList.toggle('active');
    });

    // 3. Handle checkout form submission
    const form = document.getElementById('checkoutForm');
    form?.addEventListener('submit', handleFormSubmit);
});

function renderDynamicForm(cms) {
    const fields = (cms?.checkoutFields && cms.checkoutFields.length > 0)
        ? [...cms.checkoutFields].sort((a, b) => (a.order || 0) - (b.order || 0))
        : FALLBACK_FIELDS;

    const fieldsContainer = document.getElementById('checkoutDynamicFields');
    if (!fieldsContainer) return;

    // Preserve existing user inputs if already typed
    const currentValues = {};
    fields.forEach(f => {
        const input = document.getElementById(`field_${f.id}`);
        if (input) currentValues[f.id] = input.value;
    });

    fieldsContainer.innerHTML = fields.map(field => {
        const val = currentValues[field.id] !== undefined ? currentValues[field.id] : '';
        const reqStar = field.required ? '<span style="color:#ef4444;">*</span>' : '';
        
        let inputHtml = '';
        if (field.type === 'textarea') {
            inputHtml = `
                <textarea 
                    id="field_${field.id}" 
                    name="${field.id}" 
                    rows="3" 
                    placeholder="${field.placeholder || ''}"
                    data-required="${field.required ? 'true' : 'false'}"
                    data-min="${field.minLength || 0}"
                    data-pattern="${field.pattern || ''}"
                    data-err="${field.errorMessage || ''}"
                    style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--line);font-family:inherit;font-size:0.92rem;resize:vertical;"
                >${val}</textarea>
            `;
        } else {
            inputHtml = `
                <input 
                    type="${field.type || 'text'}" 
                    id="field_${field.id}" 
                    name="${field.id}" 
                    value="${val}"
                    placeholder="${field.placeholder || ''}"
                    data-required="${field.required ? 'true' : 'false'}"
                    data-min="${field.minLength || 0}"
                    data-pattern="${field.pattern || ''}"
                    data-err="${field.errorMessage || ''}"
                    style="width:100%;padding:11px 14px;border-radius:12px;border:1px solid var(--line);font-size:0.92rem;"
                />
            `;
        }

        return `
            <div class="form-field" style="display:flex;flex-direction:column;gap:5px;">
                <label for="field_${field.id}" style="font-weight:700;font-size:0.9rem;color:var(--ink);">
                    ${field.label} ${reqStar}
                </label>
                ${inputHtml}
            </div>
        `;
    }).join('');

    // Render Payment Methods
    const payments = (cms?.paymentMethods && cms.paymentMethods.length > 0)
        ? cms.paymentMethods.filter(p => p.enabled !== false)
        : FALLBACK_PAYMENTS;

    const paymentsWrapper = document.getElementById('paymentMethodsWrapper');
    if (!paymentsWrapper) return;

    paymentsWrapper.innerHTML = payments.map((pm, idx) => `
        <label class="payment-option" style="display:flex;align-items:center;gap:8px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;cursor:pointer;background:#fff;transition:all 0.15s;">
            <input 
                type="radio" 
                name="paymentMethod" 
                value="${pm.id}" 
                data-require-receipt="${pm.requireReceipt ? 'true' : 'false'}"
                data-wallet="${pm.walletNumber || ''}"
                data-desc="${pm.description || ''}"
                ${idx === 0 ? 'checked' : ''}
            />
            <span class="payment-label" style="font-weight:700;font-size:0.9rem;">${pm.label}</span>
        </label>
    `).join('');

    attachPaymentEvents();
}

function attachPaymentEvents() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentInfo = document.getElementById('paymentInfo');
    const receiptField = document.getElementById('receiptField');
    const receiptInput = document.getElementById('receiptImage');
    const fileName = document.getElementById('fileName');

    const updatePaymentDisplay = () => {
        const selected = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selected) return;

        const requireReceipt = selected.dataset.requireReceipt === 'true';
        const wallet = selected.dataset.wallet;
        const desc = selected.dataset.desc;

        if (paymentInfo) {
            let html = '';
            if (desc) {
                html += `<div style="font-weight:600;margin-bottom:4px;color:#334155;">${desc}</div>`;
            }
            if (wallet) {
                html += `<div style="margin-top:6px;color:#0f172a;"><strong>رقم المحفظة / الحساب:</strong> <span style="direction:ltr;display:inline-block;font-weight:800;color:#0284c7;background:#e0f2fe;padding:2px 8px;border-radius:6px;">${wallet}</span></div>`;
            }
            paymentInfo.innerHTML = html;
            paymentInfo.style.display = html ? 'block' : 'none';
        }

        if (receiptField) {
            receiptField.style.display = requireReceipt ? 'flex' : 'none';
        }
    };

    paymentRadios.forEach(r => r.addEventListener('change', updatePaymentDisplay));
    updatePaymentDisplay();

    // Show file name when selected
    receiptInput?.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (fileName) fileName.textContent = `✓ تم اختيار: ${e.target.files[0].name}`;
        } else {
            if (fileName) fileName.textContent = '';
        }
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const cms = getCachedCms();
    const fields = (cms?.checkoutFields && cms.checkoutFields.length > 0)
        ? [...cms.checkoutFields].sort((a, b) => (a.order || 0) - (b.order || 0))
        : FALLBACK_FIELDS;

    const customerData = {};

    // ── Field-by-Field Dynamic Backend Validation ───────────────────
    for (const field of fields) {
        const el = document.getElementById(`field_${field.id}`);
        if (!el) continue;

        const val = el.value.trim();
        customerData[field.id] = val;

        // 1. Required Check
        if (field.required && !val) {
            await showSwalAlert(
                'warning',
                'حقل مطلوب',
                field.errorMessage || `يرجى إدخال ${field.label} لإتمام الطلب.`
            );
            el.focus();
            return;
        }

        // 2. Min Length Check
        if (val && field.minLength && val.length < field.minLength) {
            await showSwalAlert(
                'warning',
                'تنبيه في البيانات',
                field.errorMessage || `${field.label} يجب ألا يقل عن ${field.minLength} أحرف.`
            );
            el.focus();
            return;
        }

        // 3. Regex Pattern Check
        if (val && field.pattern) {
            try {
                const reg = new RegExp(field.pattern);
                if (!reg.test(val)) {
                    await showSwalAlert(
                        'warning',
                        'صيغة غير صحيحة',
                        field.errorMessage || `صيغة ${field.label} غير صحيحة، يرجى التأكد منها.`
                    );
                    el.focus();
                    return;
                }
            } catch (err) {
                console.warn('Pattern error:', err);
            }
        }
    }

    // 4. Payment Receipt Check (if required by payment method)
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (selectedPayment && selectedPayment.dataset.requireReceipt === 'true') {
        const receiptInput = document.getElementById('receiptImage');
        if (!receiptInput || !receiptInput.files || receiptInput.files.length === 0) {
            await showSwalAlert(
                'warning',
                'مطلوب صورة الإيصال',
                'لقد اخترت وسيلة دفع إلكترونية، يرجى رفع صورة إيصال التحويل لتأكيد الطلب.'
            );
            receiptInput?.focus();
            return;
        }
    }

    // 5. Build Final Order Object
    const cart = getCart();
    if (cart.length === 0) {
        await showSwalAlert('info', 'السلة فارغة', 'سلتك فارغة حالياً، يرجى إضافة منتج أولاً.');
        window.location.href = 'index.html';
        return;
    }

    const customer = {
        name: customerData.name || '',
        phone: customerData.phone || '',
        city: customerData.city || '',
        address: customerData.address || ''
    };

    // Any other custom fields put into notes
    const extraEntries = Object.entries(customerData).filter(
        ([k]) => !['name', 'phone', 'city', 'address', 'notes'].includes(k)
    );
    let finalNotes = customerData.notes || '';
    if (extraEntries.length > 0) {
        finalNotes += '\n' + extraEntries.map(([k, v]) => `${k}: ${v}`).join('\n');
    }

    // 6. SweetAlert Loading State
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري تأكيد الطلب...';
    }

    if (window.Swal) {
        window.Swal.fire({
            title: 'جاري تأكيد طلبك...',
            html: '<p style="color:#64748b;font-size:0.95rem;">يرجى الانتظار ثوانٍ معدودة لتسجيل الطلب في النظام وتجهيز رسالة الواتساب.</p>',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                window.Swal.showLoading();
            }
        });
    }

    try {
        const order = createOrder(customer, cart, finalNotes);
        const result = await submitOrder(order);

        if (result.success) {
            clearCart();

            if (window.Swal) {
                await window.Swal.fire({
                    icon: 'success',
                    title: 'تم تأكيد طلبك بنجاح!',
                    html: `
                        <div style="text-align:center;direction:rtl;">
                            <p style="font-size:1.15rem;font-weight:800;color:#0f172a;margin-bottom:6px;">
                                كود الطلب: <span style="color:#0284c7;font-family:monospace;">#${result.orderId}</span>
                            </p>
                            <p style="color:#475569;font-size:0.92rem;line-height:1.6;margin-top:8px;">
                                تم استلام بياناتك وإشعار الإدارة فوراً. سيتم فتح محادثة واتساب الآن لمتابعة الطلب والتوصيل معك.
                            </p>
                        </div>
                    `,
                    confirmButtonText: 'متابعة عبر واتساب الآن',
                    confirmButtonColor: '#22c55e'
                });
            }

            // Replace container with order success receipt
            const container = document.getElementById('checkoutContainer');
            if (container) {
                container.innerHTML = `
                    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:24px;padding:36px 24px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.04);">
                        <div style="width:68px;height:68px;background:#dcfce7;color:#15803d;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;">✓</div>
                        <h2 style="font-size:1.45rem;font-weight:800;color:#0f172a;margin:0 0 8px;">شكراً لك، تم تأكيد طلبك!</h2>
                        <p style="color:#64748b;font-size:0.95rem;margin:0 0 16px;">كود الطلب: <strong style="color:#0284c7;">#${result.orderId}</strong></p>
                        <p style="color:#475569;font-size:0.92rem;line-height:1.7;max-width:440px;margin:0 auto 24px;">تم تسجيل طلبك في النظام وإشعار الإدارة. يمكنك دائماً متابعة حالة طلبك عبر التواصل معنا على واتساب.</p>
                        <a href="index.html" class="btn-primary btn-lg" style="display:inline-block;text-decoration:none;">العودة للرئيسية</a>
                    </div>
                `;
            }
        } else {
            throw new Error(result.error || 'تعذر إتمام الطلب');
        }
    } catch (err) {
        console.error('Order submission error:', err);
        await showSwalAlert(
            'error',
            'تعذر إتمام الطلب',
            'حدث خطأ أثناء حفظ الطلب في النظام، يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
        );
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'تأكيد الطلب';
        }
    }
}
