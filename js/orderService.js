// Order Service - Abstraction Layer for Future Dashboard API Integration
// This service handles order creation and submission
// Currently uses localStorage for temporary storage
// Replace submitOrder function with actual API call when backend is ready

/**
 * Order Structure:
 * {
 *   id: string,
 *   customer: {
 *     name: string,
 *     phone: string,
 *     city: string
 *   },
 *   items: [
 *     {
 *       productId: string,
 *       productName: string,
 *       quantity: number,
 *       options: object
 *     }
 *   ],
 *   notes: string,
 *   status: string,
 *   createdAt: string
 * }
 */

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `K2-${timestamp}-${random}`;
}

// Create order object
export function createOrder(customer, items, notes = "") {
    return {
        id: generateOrderId(),
        customer,
        items,
        notes,
        status: "pending",
        createdAt: new Date().toISOString()
    };
}

// Submit order
export async function submitOrder(order) {
    try {
        // Calculate total
        let total = 0;
        order.items.forEach(item => {
            // Very basic total calc for the message, or we can just pass the total from the cart
            total += item.price ? (item.price * item.quantity) : 0; 
        });

        // Build WhatsApp Message
        let message = `*طلب جديد من موقع K2rty* 🛒\n\n`;
        message += `*بيانات العميل:*\n`;
        message += `👤 الاسم: ${order.customer.name}\n`;
        message += `📱 رقم الهاتف: ${order.customer.phone}\n`;
        message += `📍 المدينة: ${order.customer.city}\n`;
        message += `🏠 العنوان: ${order.customer.address}\n\n`;
        
        message += `*تفاصيل الطلب:*\n`;
        order.items.forEach((item, index) => {
            message += `${index + 1}. ${item.productName} (الكمية: ${item.quantity})\n`;
            if (item.options) {
                Object.entries(item.options).forEach(([key, val]) => {
                    message += `   - ${key === 'customName' ? 'الاسم المخصص' : key}: ${val}\n`;
                });
            }
        });
        
        if (order.notes) {
            message += `\n*ملاحظات إضافية:*\n${order.notes}\n`;
        }
        
        // WhatsApp number
        const phoneNumber = "201098277229";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in same tab or new tab
        window.open(whatsappUrl, '_blank');
        
        // Clear draft and return success
        clearDraftOrder();
        
        return {
            success: true,
            orderId: order.id,
            message: "تم توجيهك للواتساب"
        };
        
    } catch (error) {
        console.error('Order submission error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Get orders from localStorage (temporary)
function getLocalOrders() {
    try {
        const orders = localStorage.getItem('k2rty_orders');
        return orders ? JSON.parse(orders) : [];
    } catch {
        return [];
    }
}

// Get order by ID
export function getOrderById(orderId) {
    const orders = getLocalOrders();
    return orders.find(order => order.id === orderId);
}

// Save draft order
export function saveDraftOrder(draft) {
    try {
        localStorage.setItem('k2rty_draft', JSON.stringify(draft));
        return true;
    } catch {
        return false;
    }
}

// Get draft order
export function getDraftOrder() {
    try {
        const draft = localStorage.getItem('k2rty_draft');
        return draft ? JSON.parse(draft) : null;
    } catch {
        return null;
    }
}

// Clear draft order
export function clearDraftOrder() {
    try {
        localStorage.removeItem('k2rty_draft');
        return true;
    } catch {
        return false;
    }
}

// Validate order
export function validateOrder(order) {
    const errors = [];
    
    if (!order.customer.name || order.customer.name.trim().length < 2) {
        errors.push("الاسم مطلوب");
    }
    
    if (!order.customer.phone || order.customer.phone.trim().length < 11) {
        errors.push("رقم الهاتف غير صحيح");
    }
    
    if (!order.customer.city || order.customer.city.trim().length < 2) {
        errors.push("المدينة مطلوبة");
    }
    
    if (!order.items || order.items.length === 0) {
        errors.push("يجب اختيار منتج واحد على الأقل");
    }
    
    order.items.forEach((item, index) => {
        if (!item.quantity || item.quantity < 1) {
            errors.push(`الكمية غير صحيحة للمنتج ${index + 1}`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors
    };
}
