// Order Service - Direct Backend API Integration & WhatsApp Confirmation
// Submits orders to the smart-card-qr Backend API & saves to database
// Opens WhatsApp with order summary for customer confirmation

import { getApiBaseUrl, getCachedCms } from './cms.js';
import { getProductById, calculatePrice } from './products.js';

function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900 + 100);
    return `K2-${timestamp}-${random}`;
}

// Create order object
export function createOrder(customer, items, notes = "") {
    const normalizedItems = (items || []).map(it => {
        const prodId = it.productId || it.id || "sticker";
        const prod = getProductById(prodId);
        const calculatedPrice = calculatePrice(prodId, it.options || {});
        const unitPrice = (typeof it.price === 'number' && it.price > 0) ? it.price : (calculatedPrice || prod?.basePrice || 650);
        return {
            productId: prodId,
            productName: it.productName || it.name || prod?.name || "كوستر K2rty الذكي",
            quantity: Number(it.quantity) || 1,
            price: unitPrice,
            options: it.options || {}
        };
    });

    return {
        id: generateOrderId(),
        customer,
        items: normalizedItems,
        notes,
        status: "pending",
        createdAt: new Date().toISOString()
    };
}

// Submit order to Backend API & WhatsApp
export async function submitOrder(order) {
    try {
        let total = 0;
        const normalizedItems = (order.items || []).map(it => {
            const prodId = it.productId || it.id || "sticker";
            const prod = getProductById(prodId);
            const calculatedPrice = calculatePrice(prodId, it.options || {});
            const unitPrice = (typeof it.price === 'number' && it.price > 0) ? it.price : (calculatedPrice || prod?.basePrice || 650);
            const qty = Number(it.quantity) || 1;
            total += unitPrice * qty;

            return {
                productId: prodId,
                productName: it.productName || it.name || prod?.name || "كوستر K2rty الذكي",
                quantity: qty,
                price: unitPrice,
                options: it.options || {}
            };
        });

        order.items = normalizedItems;

        // 1. Submit to Backend API
        let confirmedOrderId = order.id;
        try {
            const apiBase = getApiBaseUrl();
            const response = await fetch(`${apiBase}/website/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    customer: {
                        name: order.customer.name,
                        phone: order.customer.phone,
                        city: order.customer.city,
                        address: order.customer.address || ""
                    },
                    items: normalizedItems,
                    totalAmount: total > 0 ? total : 650,
                    notes: order.notes || "",
                    receiptUrl: order.receiptUrl || "",
                    paymentMethod: order.paymentMethod || "",
                    customPrint: order.customPrint || null
                })
            });

            if (response.ok) {
                const savedOrder = await response.json();
                if (savedOrder && savedOrder.orderId) {
                    confirmedOrderId = savedOrder.orderId;
                }
            } else {
                console.warn("Backend order creation warning:", await response.text());
            }
        } catch (apiErr) {
            console.warn("Network error submitting to backend, order saved locally:", apiErr);
        }

        // 2. Save order locally as well
        saveLocalOrder({ ...order, id: confirmedOrderId, total: total > 0 ? total : 650 });

        // 3. Build WhatsApp message
        let message = `*طلب جديد من موقع K2rty* 🛒\n`;
        message += `رقم الطلب: #${confirmedOrderId}\n\n`;
        message += `*بيانات العميل:*\n`;
        message += `👤 الاسم: ${order.customer.name}\n`;
        message += `📱 رقم الهاتف: ${order.customer.phone}\n`;
        message += `📍 المدينة: ${order.customer.city}\n`;
        if (order.customer.address) {
            message += `🏠 العنوان: ${order.customer.address}\n`;
        }
        message += `\n*تفاصيل الطلب:*\n`;
        order.items.forEach((item, index) => {
            message += `${index + 1}. ${item.productName} (الكمية: ${item.quantity}) - السعر: ${item.price} جنيه\n`;
            if (item.options) {
                Object.entries(item.options).forEach(([key, val]) => {
                    message += `   - ${key === 'customName' ? 'الاسم' : key}: ${val}\n`;
                });
            }
        });

        message += `\n💰 *الإجمالي:* ${total > 0 ? total : 650} جنيه\n`;

        if (order.paymentMethod) {
            let pLabel = order.paymentMethod;
            if (pLabel === 'vodafone_cash') pLabel = 'فودافون كاش';
            else if (pLabel === 'instapay') pLabel = 'إنستا باي';
            else if (pLabel === 'cod') pLabel = 'الدفع عند الاستلام';
            message += `💳 *طريقة الدفع:* ${pLabel}\n`;
        }

        if (order.receiptUrl) {
            message += `🧾 *صورة إيصال التحويل:* ${order.receiptUrl}\n`;
        }

        if (order.customPrint && order.customPrint.text) {
            message += `\n🎨 *تفاصيل الطباعة المخصصة:*\n`;
            message += `✍️ النص: ${order.customPrint.text}\n`;
            if (order.customPrint.imageUrl) {
                message += `🖼️ صورة التصميم: ${order.customPrint.imageUrl}\n`;
            }
            if (order.customPrint.notes) {
                message += `📝 ملاحظات: ${order.customPrint.notes}\n`;
            }
        }

        if (order.notes) {
            message += `\n*ملاحظات إضافية:*\n${order.notes}\n`;
        }

        // Dynamic WhatsApp number from CMS
        const cms = getCachedCms();
        const phoneNumber = cms?.contact?.whatsappNumber || "201098277229";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        // Clear draft
        clearDraftOrder();

        return {
            success: true,
            orderId: confirmedOrderId,
            message: "تم حفظ الطلب وتوجيهك للواتساب"
        };

    } catch (error) {
        console.error('Order submission error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Local storage helpers
function saveLocalOrder(order) {
    try {
        const orders = getLocalOrders();
        orders.unshift(order);
        localStorage.setItem('k2rty_orders', JSON.stringify(orders));
    } catch (_) {}
}

export function getLocalOrders() {
    try {
        const orders = localStorage.getItem('k2rty_orders');
        return orders ? JSON.parse(orders) : [];
    } catch {
        return [];
    }
}

export function getOrderById(orderId) {
    const orders = getLocalOrders();
    return orders.find(order => order.id === orderId);
}

export function saveDraftOrder(draft) {
    try {
        localStorage.setItem('k2rty_draft', JSON.stringify(draft));
        return true;
    } catch {
        return false;
    }
}

export function getDraftOrder() {
    try {
        const draft = localStorage.getItem('k2rty_draft');
        return draft ? JSON.parse(draft) : null;
    } catch {
        return null;
    }
}

export function clearDraftOrder() {
    try {
        localStorage.removeItem('k2rty_draft');
        return true;
    } catch {
        return false;
    }
}

export function validateOrder(order) {
    const errors = [];
    if (!order.customer.name || order.customer.name.trim().length < 2) {
        errors.push("الاسم مطلوب");
    }
    if (!order.customer.phone || order.customer.phone.trim().length < 10) {
        errors.push("رقم الهاتف غير صحيح");
    }
    if (!order.customer.city || order.customer.city.trim().length < 2) {
        errors.push("المدينة مطلوبة");
    }
    if (!order.items || order.items.length === 0) {
        errors.push("يجب اختيار منتج واحد على الأقل");
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
