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
// TODO: Replace with actual API call to Dashboard
// Example: POST /api/orders
export async function submitOrder(order) {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // TEMPORARY: Save to localStorage
        // This will be replaced with actual API call
        const orders = getLocalOrders();
        orders.push(order);
        localStorage.setItem('k2rty_orders', JSON.stringify(orders));
        
        // FUTURE API IMPLEMENTATION:
        // const response = await fetch('/api/orders', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(order)
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to submit order');
        // }
        // 
        // return await response.json();
        
        return {
            success: true,
            orderId: order.id,
            message: "Order submitted successfully"
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
