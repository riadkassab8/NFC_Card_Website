// Order Builder - Creative Order Flow
import { getProductById, calculatePrice, getProductImage, formatPrice, getPriceBreakdown } from './products.js';
import { createOrder, submitOrder, validateOrder, saveDraftOrder } from './orderService.js';
import { showToast, setLoading, createSuccessMessage, createOrderSummary } from './ui.js';

let orderState = {
    step: 1,
    items: [],
    customer: {
        name: '',
        phone: '',
        city: ''
    },
    notes: ''
};

// Initialize order builder
export function initOrderBuilder(preselectedProductId = null) {
    orderState = {
        step: 1,
        items: preselectedProductId ? [{
            productId: preselectedProductId,
            productName: getProductById(preselectedProductId).name,
            quantity: 1,
            options: {},
            price: getProductById(preselectedProductId).basePrice
        }] : [],
        customer: { name: '', phone: '', city: '' },
        notes: ''
    };
    
    renderStep();
}

// Render current step
function renderStep() {
    const builder = document.getElementById('orderBuilder');
    
    switch (orderState.step) {
        case 1:
            builder.innerHTML = renderStep1();
            break;
        case 2:
            builder.innerHTML = renderStep2();
            break;
        case 3:
            builder.innerHTML = renderStep3();
            break;
        case 4:
            builder.innerHTML = renderStep4();
            break;
        case 5:
            builder.innerHTML = renderStep5();
            break;
    }
    
    attachStepEvents();
}

// Step 1: Product Selection
function renderStep1() {
    const hasItems = orderState.items.length > 0;
    
    return `
        <div class="order-step">
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">إيه اللي محتاجه؟</h2>
            <p style="color: var(--text-muted); text-align: center; margin-bottom: 2rem;">اختار المنتج أو المنتجات اللي تناسبك</p>
            
            <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                ${renderProductOptions()}
            </div>
            
            ${hasItems ? `
                <div style="background: var(--accent-soft); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">المنتجات المختارة:</div>
                    ${orderState.items.map((item, index) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0;">
                            <span>${item.productName}</span>
                            <button onclick="window.removeOrderItem(${index})" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.25rem;">&times;</button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                ${hasItems ? `<button class="btn-primary btn-lg" onclick="window.nextOrderStep()">التالي</button>` : ''}
            </div>
        </div>
    `;
}

function renderProductOptions() {
    const products = ['physical', 'card', 'stand'];
    return products.map(productId => {
        const product = getProductById(productId);
        const isSelected = orderState.items.some(item => item.productId === productId);
        
        return `
            <button 
                onclick="window.selectProduct('${productId}')"
                style="
                    padding: 1.5rem;
                    background: ${isSelected ? 'var(--accent)' : 'var(--surface)'};
                    color: ${isSelected ? 'white' : 'var(--text)'};
                    border: 2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'};
                    border-radius: var(--radius-lg);
                    font-size: 1.125rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    font-family: var(--font-ar);
                    text-align: right;
                "
            >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${product.name}</span>
                    <span style="font-size: 1.5rem;">${isSelected ? '✓' : '◆'}</span>
                </div>
                <div style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.5rem;">يبدأ من ${formatPrice(product.basePrice, product.currency)}</div>
            </button>
        `;
    }).join('');
}

// Step 2: Quantities
function renderStep2() {
    return `
        <div class="order-step">
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">كام واحد محتاج؟</h2>
            <p style="color: var(--text-muted); text-align: center; margin-bottom: 2rem;">حدد الكمية لكل منتج</p>
            
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem;">
                ${orderState.items.map((item, index) => renderQuantitySelector(item, index)).join('')}
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-secondary btn-lg" onclick="window.prevOrderStep()">رجوع</button>
                <button class="btn-primary btn-lg" onclick="window.nextOrderStep()">التالي</button>
            </div>
        </div>
    `;
}

function renderQuantitySelector(item, index) {
    return `
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem;">
            <div style="font-weight: 600; margin-bottom: 1rem; font-size: 1.125rem;">${item.productName}</div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 2rem;">
                <button onclick="window.decreaseQuantity(${index})" style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-soft); border: none; font-size: 1.5rem; cursor: pointer; font-weight: 700;">−</button>
                <span style="font-size: 2rem; font-weight: 700; min-width: 60px; text-align: center;">${item.quantity}</span>
                <button onclick="window.increaseQuantity(${index})" style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent); color: white; border: none; font-size: 1.5rem; cursor: pointer; font-weight: 700;">+</button>
            </div>
        </div>
    `;
}

// Step 3: Options/Customization
function renderStep3() {
    const hasOptions = orderState.items.some(item => {
        const product = getProductById(item.productId);
        return product.options && product.options.length > 0;
    });
    
    if (!hasOptions) {
        // Skip to next step if no options available
        orderState.step = 4;
        renderStep();
        return;
    }
    
    return `
        <div class="order-step">
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">خصص طلبك</h2>
            <p style="color: var(--text-muted); text-align: center; margin-bottom: 2rem;">اختار الإضافات والتفاصيل (السعر يتغير حسب الاختيار)</p>
            
            <div style="display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem;">
                ${orderState.items.map((item, itemIndex) => {
                    const product = getProductById(item.productId);
                    if (!product.options || product.options.length === 0) return '';
                    
                    const currentPrice = calculatePrice(item.productId, item.options);
                    const priceBreakdown = getPriceBreakdown(item.productId, item.options);
                    
                    return `
                        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <h3 style="font-weight: 600; font-size: 1.125rem;">${product.name}</h3>
                                <div style="font-weight: 700; color: var(--accent);">${formatPrice(currentPrice, product.currency)}</div>
                            </div>
                            
                            ${renderProductImage(item.productId, item.options)}
                            
                            ${product.options.map(option => `
                                <div style="margin-bottom: 1rem;">
                                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">
                                        ${option.label} ${option.required ? '<span style="color: red;">*</span>' : ''}
                                    </label>
                                    <select 
                                        onchange="window.updateOption(${itemIndex}, '${option.id}', this.value)"
                                        style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-ar); font-size: 1rem;"
                                    >
                                        <option value="">اختر...</option>
                                        ${option.choices.map(choice => `
                                            <option value="${choice.value}" ${item.options[option.id] === choice.value ? 'selected' : ''}>
                                                ${choice.label} ${choice.priceModifier > 0 ? `(+${choice.priceModifier} جنيه)` : ''}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                            `).join('')}
                            
                            ${priceBreakdown.additions.length > 0 ? `
                                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                                    <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;">تفاصيل السعر:</div>
                                    <div style="font-size: 0.875rem;">
                                        <div>السعر الأساسي: ${formatPrice(priceBreakdown.basePrice, product.currency)}</div>
                                        ${priceBreakdown.additions.map(add => `
                                            <div>+ ${add.label}: ${formatPrice(add.price, product.currency)}</div>
                                        `).join('')}
                                        <div style="font-weight: 700; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border);">
                                            الإجمالي: ${formatPrice(priceBreakdown.total, product.currency)}
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-secondary btn-lg" onclick="window.prevOrderStep()">رجوع</button>
                <button class="btn-primary btn-lg" onclick="window.nextOrderStep()">التالي</button>
            </div>
        </div>
    `;
}

// Render product image based on options
function renderProductImage(productId, selectedOptions) {
    const imagePath = getProductImage(productId, selectedOptions);
    
    if (!imagePath || !imagePath.startsWith('assets/')) {
        // Use CSS-based visual if no real image
        return `<div style="min-height: 150px; background: var(--accent-soft); border-radius: var(--radius-md); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">صورة المنتج</div>`;
    }
    
    return `
        <div style="margin-bottom: 1rem;">
            <img 
                src="${imagePath}" 
                alt="صورة المنتج"
                style="width: 100%; height: auto; border-radius: var(--radius-md); object-fit: cover; max-height: 250px;"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div style="display: none; min-height: 150px; background: var(--accent-soft); border-radius: var(--radius-md); align-items: center; justify-content: center; color: var(--text-muted);">صورة المنتج</div>
        </div>
    `;
}

// Step 4: Customer Information
function renderStep4() {
    return `
        <div class="order-step">
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">بيانات التواصل</h2>
            <p style="color: var(--text-muted); text-align: center; margin-bottom: 2rem;">عشان نقدر نتواصل معاك</p>
            
            <form id="customerForm" style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem;">
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">الاسم *</label>
                    <input 
                        type="text" 
                        id="customerName"
                        value="${orderState.customer.name}"
                        placeholder="أدخل اسمك"
                        required
                        style="width: 100%; padding: 0.875rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-ar); font-size: 1rem;"
                    />
                </div>
                
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">رقم الهاتف (WhatsApp) *</label>
                    <input 
                        type="tel" 
                        id="customerPhone"
                        value="${orderState.customer.phone}"
                        placeholder="01xxxxxxxxx"
                        required
                        style="width: 100%; padding: 0.875rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-ar); font-size: 1rem;"
                    />
                </div>
                
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">المحافظة/المدينة *</label>
                    <input 
                        type="text" 
                        id="customerCity"
                        value="${orderState.customer.city}"
                        placeholder="القاهرة، الإسكندرية، إلخ..."
                        required
                        style="width: 100%; padding: 0.875rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-ar); font-size: 1rem;"
                    />
                </div>
                
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">ملاحظات (اختياري)</label>
                    <textarea 
                        id="orderNotes"
                        placeholder="أي ملاحظات أو طلبات خاصة؟"
                        rows="3"
                        style="width: 100%; padding: 0.875rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-ar); font-size: 1rem; resize: vertical;"
                    >${orderState.notes}</textarea>
                </div>
            </form>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-secondary btn-lg" onclick="window.prevOrderStep()">رجوع</button>
                <button class="btn-primary btn-lg" onclick="window.saveCustomerInfo()">التالي</button>
            </div>
        </div>
    `;
}

// Step 5: Summary & Submit
function renderStep5() {
    return `
        <div class="order-step">
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">جاهز للإرسال؟</h2>
            <p style="color: var(--text-muted); text-align: center; margin-bottom: 2rem;">تأكد من بياناتك قبل الإرسال</p>
            
            ${createOrderSummary(orderState.items, orderState.customer)}
            
            ${orderState.notes ? `
                <div style="background: var(--accent-soft); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">ملاحظات:</div>
                    <div style="color: var(--text-muted);">${orderState.notes}</div>
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-secondary btn-lg" onclick="window.prevOrderStep()">رجوع</button>
                <button class="btn-primary btn-lg" id="submitOrderBtn" onclick="window.submitOrderHandler()">إرسال الطلب</button>
            </div>
        </div>
    `;
}

// Attach event handlers
function attachStepEvents() {
    // Events are handled through window functions for simplicity
}

// Navigation functions
window.nextOrderStep = function() {
    if (orderState.step < 5) {
        orderState.step++;
        renderStep();
    }
};

window.prevOrderStep = function() {
    if (orderState.step > 1) {
        orderState.step--;
        renderStep();
    }
};

// Product selection
window.selectProduct = function(productId) {
    const existingIndex = orderState.items.findIndex(item => item.productId === productId);
    
    if (existingIndex >= 0) {
        orderState.items.splice(existingIndex, 1);
    } else {
        const product = getProductById(productId);
        orderState.items.push({
            productId,
            productName: product.name,
            quantity: 1,
            options: {},
            price: product.basePrice
        });
    }
    
    renderStep();
};

window.removeOrderItem = function(index) {
    orderState.items.splice(index, 1);
    renderStep();
};

// Quantity control
window.increaseQuantity = function(index) {
    orderState.items[index].quantity++;
    renderStep();
};

window.decreaseQuantity = function(index) {
    if (orderState.items[index].quantity > 1) {
        orderState.items[index].quantity--;
        renderStep();
    }
};

// Options
window.updateOption = function(itemIndex, optionId, value) {
    orderState.items[itemIndex].options[optionId] = value;
    
    // Recalculate price when options change
    const item = orderState.items[itemIndex];
    item.price = calculatePrice(item.productId, item.options);
    
    saveDraftOrder(orderState);
    renderStep(); // Re-render to show updated price and image
};

// Customer info
window.saveCustomerInfo = function() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const city = document.getElementById('customerCity').value.trim();
    const notes = document.getElementById('orderNotes').value.trim();
    
    if (!name || !phone || !city) {
        showToast('من فضلك املأ جميع الحقول المطلوبة');
        return;
    }
    
    orderState.customer = { name, phone, city };
    orderState.notes = notes;
    
    saveDraftOrder(orderState);
    window.nextOrderStep();
};

// Submit order
window.submitOrderHandler = async function() {
    const button = document.getElementById('submitOrderBtn');
    setLoading(button, true);
    
    const order = createOrder(orderState.customer, orderState.items, orderState.notes);
    const validation = validateOrder(order);
    
    if (!validation.valid) {
        showToast(validation.errors[0]);
        setLoading(button, false);
        return;
    }
    
    const result = await submitOrder(order);
    setLoading(button, false);
    
    if (result.success) {
        document.getElementById('orderBuilder').innerHTML = createSuccessMessage(result.orderId);
        showToast('تم إرسال طلبك بنجاح');
    } else {
        showToast('حدث خطأ، حاول مرة أخرى');
    }
};

export { renderStep };
