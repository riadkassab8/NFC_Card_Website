import { getCart, getCartTotal, clearCart } from './cart.js';
import { createOrder, submitOrder } from './orderService.js';
import { getCachedCms, fetchLiveCms, getApiBaseUrl } from './cms.js';
import { syncLiveProducts } from './products.js';

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
    try {
        await syncLiveProducts();
    } catch (_) {}

    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const totalEl = document.getElementById('checkoutTotal');
    if (totalEl) {
        totalEl.textContent = `${getCartTotal()} جنيه`;
    }

    // Check if custom print is selected in cart
    checkCustomPrintSelection(cart);

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

function checkCustomPrintSelection(cart) {
    const customPrintSection = document.getElementById('customPrintSection');
    if (!customPrintSection) return;

    // Check if any item in cart has custom_print = 'yes'
    const hasCustomPrint = cart.some(item => {
        return item.options && item.options.custom_print === 'yes';
    });

    if (hasCustomPrint) {
        customPrintSection.style.display = 'block';
    } else {
        customPrintSection.style.display = 'none';
    }
}

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

    let receiptUrl = '';
    const receiptInput = document.getElementById('receiptImage');
    if (receiptInput && receiptInput.files && receiptInput.files.length > 0) {
        if (window.Swal) {
            window.Swal.update({
                title: 'جاري رفع صورة الإيصال...',
                html: '<p style="color:#64748b;font-size:0.95rem;">يرجى الانتظار ثوانٍ معدودة لرفع صورة الإيصال وتثبيتها في طلبك...</p>'
            });
        }
        try {
            const formData = new FormData();
            formData.append('file', receiptInput.files[0]);
            const uploadRes = await fetch(`${getApiBaseUrl()}/website/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                receiptUrl = uploadData.url || '';
            } else {
                console.warn('Receipt upload warning:', await uploadRes.text());
            }
        } catch (uploadErr) {
            console.warn('Receipt upload network error:', uploadErr);
        }
    }

    // Upload custom print image if selected
    let customPrintImageUrl = '';
    const customPrintInput = document.getElementById('customPrintImage');
    if (customPrintInput && customPrintInput.files && customPrintInput.files.length > 0) {
        if (window.Swal) {
            window.Swal.update({
                title: 'جاري رفع صورة التصميم المخصص...',
                html: '<p style="color:#64748b;font-size:0.95rem;">يرجى الانتظار ثوانٍ معدودة لرفع صورة التصميم...</p>'
            });
        }
        try {
            const formData = new FormData();
            formData.append('file', customPrintInput.files[0]);
            const uploadRes = await fetch(`${getApiBaseUrl()}/website/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                customPrintImageUrl = uploadData.url || '';
            } else {
                console.warn('Custom print image upload warning:', await uploadRes.text());
            }
        } catch (uploadErr) {
            console.warn('Custom print image upload network error:', uploadErr);
        }
    }

    try {
        const order = createOrder(customer, cart, finalNotes);
        order.receiptUrl = receiptUrl;
        order.paymentMethod = selectedPayment?.value || 'cod';
        
        // Add custom print details if selected
        const customPrintSection = document.getElementById('customPrintSection');
        if (customPrintSection && customPrintSection.style.display !== 'none') {
            order.customPrint = {
                text: document.getElementById('customPrintText')?.value || '',
                imageUrl: customPrintImageUrl,
                notes: document.getElementById('customPrintNotes')?.value || ''
            };
        }
        
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
                const whatsappNumber = '201098277229';
                const message = encodeURIComponent(`مرحباً، تم تقديم طلب جديد برقم: ${result.orderId}`);
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
                
                container.innerHTML = `
                    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:24px;padding:36px 24px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.04);">
                        <div style="width:68px;height:68px;background:#dcfce7;color:#15803d;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;">✓</div>
                        <h2 style="font-size:1.45rem;font-weight:800;color:#0f172a;margin:0 0 8px;">شكراً لك، تم تأكيد طلبك!</h2>
                        <p style="color:#64748b;font-size:0.95rem;margin:0 0 16px;">كود الطلب: <strong style="color:#0284c7;">#${result.orderId}</strong></p>
                        <p style="color:#475569;font-size:0.92rem;line-height:1.7;max-width:440px;margin:0 auto 24px;">تم تسجيل طلبك في النظام وإشعار الإدارة. يمكنك دائماً متابعة حالة طلبك عبر التواصل معنا على واتساب.</p>
                        <div style="display:flex;flex-direction:column;gap:12px;align-items:center;">
                            <a href="${whatsappUrl}" target="_blank" class="btn-primary btn-lg" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                المتابعة عبر واتساب
                            </a>
                            <a href="index.html" class="btn-secondary btn-lg" style="display:inline-block;text-decoration:none;background:#e2e8f0;color:#475569;">العودة للرئيسية</a>
                        </div>
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
