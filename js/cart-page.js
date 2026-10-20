import { getCart, removeFromCart, updateQuantity, getCartTotal } from './cart.js';
import { getProductById, calculatePrice, getProductImage, getOptionLabel } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const container = document.getElementById('cartContainer');
    const cart = getCart().filter(item => getProductById(item.productId));

    if (cart.length === 0) {
        container.style.gridTemplateColumns = '1fr';
        container.innerHTML = `
            <div style="text-align:center;padding:3.5rem 1.5rem;background:#fff;border:1px solid var(--line);border-radius:24px;">
                <h2 style="font-size:1.4rem;margin-bottom:0.6rem;">السلة فارغة</h2>
                <p style="color:var(--muted);margin-bottom:1.4rem;">ابدأ بكوستر K2rty الذكي.</p>
                <a href="product.html?id=sticker" class="btn-primary">اطلب المنتج</a>
            </div>
        `;
        return;
    }

    const cartTotal = getCartTotal();
    if (window.innerWidth >= 1024) {
        container.style.gridTemplateColumns = '2fr 1fr';
    }

    container.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:1rem;">
            ${cart.map((item, index) => {
                const product = getProductById(item.productId);
                const price = calculatePrice(item.productId, item.options);
                const image = getProductImage(item.productId, item.options) || product.defaultImage;
                const optionText = Object.entries(item.options || {})
                    .filter(([key]) => key !== 'customName')
                    .map(([key, val]) => getOptionLabel(item.productId, key, val))
                    .join(' · ');

                return `
                    <div class="cart-item-card">
                        <div class="cart-item-image">
                            <img src="${image}" alt="${product.name}">
                        </div>
                        <div class="cart-item-details">
                            <div>
                                <h3 style="font-size:1.15rem;font-weight:800;">${product.name}</h3>
                                <div style="color:var(--accent);font-weight:800;margin:0.25rem 0 0.4rem;">${price} ${product.currency}</div>
                                ${optionText ? `<div style="color:var(--muted);font-size:0.9rem;">${optionText}</div>` : ''}
                            </div>
                            <div class="cart-item-actions">
                                <div class="cart-qty-controls">
                                    <button class="qty-btn" data-action="dec" data-index="${index}">−</button>
                                    <span class="qty-display">${item.quantity}</span>
                                    <button class="qty-btn" data-action="inc" data-index="${index}">+</button>
                                </div>
                                <button class="remove-btn" data-index="${index}">حذف</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="background:#fff;padding:1.5rem;border-radius:20px;border:1px solid var(--line);align-self:start;position:sticky;top:96px;">
            <h3 style="font-size:1.25rem;font-weight:800;margin-bottom:1.1rem;">ملخص الطلب</h3>
            <div style="display:flex;justify-content:space-between;margin-bottom:0.7rem;color:var(--muted);">
                <span>المجموع</span><span>${cartTotal} جنيه</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:1rem;color:var(--muted);">
                <span>الشحن</span><span>يُحسب لاحقًا</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:1.15rem;font-weight:800;border-top:1px solid var(--line);padding-top:1rem;margin-bottom:1.3rem;">
                <span>الإجمالي</span><span>${cartTotal} جنيه</span>
            </div>
            <a href="checkout.html" class="btn-primary btn-lg" style="width:100%;">إتمام الطلب</a>
        </div>
    `;

    attachEvents();
}

function attachEvents() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeFromCart(parseInt(e.currentTarget.dataset.index, 10));
            renderCart();
        });
    });

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index, 10);
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
