import { getProductById, calculatePrice } from './products.js';

export function getCart() {
    const cartStr = localStorage.getItem('k2rty_cart');
    if (!cartStr) return [];
    try {
        const cart = JSON.parse(cartStr);
        return cart.map(item => {
            if (!item.price || !item.productName) {
                const prod = getProductById(item.productId);
                item.price = calculatePrice(item.productId, item.options);
                item.productName = prod ? prod.name : 'كوستر K2rty الذكي';
            }
            return item;
        });
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem('k2rty_cart', JSON.stringify(cart));
    updateCartBadge();
}

export function addToCart(productId, quantity, options) {
    const cart = getCart();
    const product = getProductById(productId);
    const price = calculatePrice(productId, options);
    
    // Check if same product + options exists
    const optionsString = JSON.stringify(options);
    const existingIndex = cart.findIndex(item => item.productId === productId && JSON.stringify(item.options) === optionsString);
    
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
        cart[existingIndex].price = price;
        cart[existingIndex].productName = product ? product.name : 'كوستر K2rty الذكي';
    } else {
        cart.push({
            productId,
            productName: product ? product.name : 'كوستر K2rty الذكي',
            price,
            quantity,
            options
        });
    }
    
    saveCart(cart);
}

export function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

export function updateQuantity(index, quantity) {
    const cart = getCart();
    if (quantity > 0) {
        cart[index].quantity = quantity;
        saveCart(cart);
    }
}

export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        const price = item.price || calculatePrice(item.productId, item.options);
        return total + (price * item.quantity);
    }, 0);
}

export function clearCart() {
    localStorage.removeItem('k2rty_cart');
    updateCartBadge();
}

export function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Initialize badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
