import { getCart, getCartTotal, clearCart } from './cart.js';
import { createOrder, submitOrder } from './orderService.js';
import { showToast, setLoading, createSuccessMessage } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    document.getElementById('checkoutTotal').textContent = `${getCartTotal()} جنيه`;
    
    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const customer = {
            name: document.getElementById('custName').value.trim(),
            phone: document.getElementById('custPhone').value.trim(),
            city: document.getElementById('custCity').value.trim(),
            address: document.getElementById('custAddress').value.trim()
        };
        const notes = document.getElementById('orderNotes').value.trim();
        
        const btn = document.getElementById('submitBtn');
        setLoading(btn, true);
        
        const order = createOrder(customer, cart, notes);
        const result = await submitOrder(order);
        
        setLoading(btn, false);
        
        if (result.success) {
            clearCart();
            document.getElementById('checkoutContainer').innerHTML = createSuccessMessage(result.orderId);
            showToast('تم تأكيد الطلب بنجاح');
        } else {
            showToast('حدث خطأ أثناء الطلب، يرجى المحاولة مرة أخرى.');
        }
    });
});
