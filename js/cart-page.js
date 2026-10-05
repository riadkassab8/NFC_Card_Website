import { getCart, removeFromCart, updateQuantity, getCartTotal } from './cart.js';
import { getProductById, calculatePrice, getProductImage } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const container = document.getElementById('cartContainer');
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem; background: var(--surface); border-radius: var(--radius-xl); border: 1px solid var(--border);">
                <div style="margin-bottom: 1.5rem;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); margin: 0 auto;">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">السلة فارغة</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
                <a href="index.html#products" class="btn-primary" style="display: inline-block; text-decoration: none;">تصفح المنتجات</a>
            </div>
        `;
        // Desktop grid clear
        container.style.gridTemplateColumns = '1fr';
        return;
    }
    
    const cartTotal = getCartTotal();
    
    // Desktop layout adjustment
    if (window.innerWidth >= 1024) {
        container.style.gridTemplateColumns = '2fr 1fr';
    }
    
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${cart.map((item, index) => {
                const product = getProductById(item.productId);
                const price = calculatePrice(item.productId, item.options);
                const image = getProductImage(item.productId, item.options) || product.defaultImage;
                
                return `
                    <div style="display: flex; gap: 1.5rem; background: var(--surface); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); position: relative;">
                        
                        <div style="width: 120px; height: 120px; border-radius: var(--radius-md); overflow: hidden; background: var(--accent-soft); flex-shrink: 0;">
                            <img src="${image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        
                        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">${product.name}</h3>
                                <div style="color: var(--accent); font-weight: 700; margin-bottom: 0.5rem;">${price} ${product.currency}</div>
                                
                                ${Object.keys(item.options).length > 0 ? `
                                    <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">
                                        ${Object.entries(item.options).map(([key, val]) => `<span>${val}</span>`).join(' | ')}
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <button class="qty-btn" data-action="dec" data-index="${index}" style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer;">−</button>
                                    <span style="font-weight: 600; width: 20px; text-align: center;">${item.quantity}</span>
                                    <button class="qty-btn" data-action="inc" data-index="${index}" style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer;">+</button>
                                </div>
                                <button class="remove-btn" data-index="${index}" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: var(--radius-sm); transition: background 0.2s;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    <span style="font-weight: 600;">حذف</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div style="background: var(--surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border); align-self: start; position: sticky; top: 100px;">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">ملخص الطلب</h3>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-muted);">
                <span>المجموع الفرعي</span>
                <span>${cartTotal} جنيه</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; color: var(--text-muted);">
                <span>الشحن</span>
                <span>يتم حسابه لاحقاً</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 1.25rem; font-weight: 700; border-top: 1px solid var(--border); padding-top: 1rem;">
                <span>الإجمالي</span>
                <span style="color: var(--accent);">${cartTotal} جنيه</span>
            </div>
            
            <a href="checkout.html" class="btn-primary btn-lg" style="display: block; text-align: center; text-decoration: none; width: 100%;">
                إتمام الطلب
            </a>
        </div>
    `;
    
    attachEvents();
}

function attachEvents() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            removeFromCart(index);
            renderCart();
        });
    });
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            const action = e.currentTarget.dataset.action;
            const cart = getCart();
            let qty = cart[index].quantity;
            
            if (action === 'inc') qty++;
            else if (action === 'dec' && qty > 1) qty--;
            
            updateQuantity(index, qty);
            renderCart();
        });
    });
}
