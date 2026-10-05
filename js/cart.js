import { getProductById, calculatePrice } from './products.js';

export function getCart() {
    const cart = localStorage.getItem('k2rty_cart');
    return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
    localStorage.setItem('k2rty_cart', JSON.stringify(cart));
    updateCartBadge();
}

export function addToCart(productId, quantity, options) {
    const cart = getCart();
    
    // Check if same product + options exists
    const optionsString = JSON.stringify(options);
    const existingIndex = cart.findIndex(item => item.productId === productId && JSON.stringify(item.options) === optionsString);
    
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            productId,
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
        const price = calculatePrice(item.productId, item.options);
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
