// Main Application Entry Point
import { getProductById } from './products.js';
import { updateCartBadge } from './cart.js';
import { 
    showModal, 
    hideModal, 
    scrollToSection, 
    createProductVisual, 
    createFeatureList, 
    animateOnScroll,
    toggleFaqItem 
} from './ui.js';

// State
let currentProduct = 'physical';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProductShowcase();
    initFAQ();
    animateOnScroll();
    updateCartBadge();
    
    // Load initial product
    updateProductDisplay(currentProduct);
});

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            scrollToSection(targetId);
            
            // Close mobile menu
            navToggle?.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // CTA buttons
    document.getElementById('navCta')?.addEventListener('click', () => {
        scrollToSection('products');
    });
    
    document.getElementById('heroCta')?.addEventListener('click', () => {
        scrollToSection('products');
    });
    
    // Removed heroSecondary event listener as it's an anchor now
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// Product Showcase
function initProductShowcase() {
    const tabs = document.querySelectorAll('.selector-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const productId = tab.dataset.product;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update display
            currentProduct = productId;
            updateProductDisplay(productId);
        });
    });
}

function updateProductDisplay(productId) {
    const product = getProductById(productId);
    const visualEl = document.getElementById('productVisual');
    const infoEl = document.getElementById('productInfo');
    
    // Fade out
    visualEl.style.opacity = '0';
    infoEl.style.opacity = '0';
    
    setTimeout(() => {
        // Update content
        visualEl.innerHTML = createProductVisual(product);
        infoEl.innerHTML = `
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <ul class="product-features">
                ${createFeatureList(product.features)}
            </ul>
            <div class="product-price">يبدأ من ${product.basePrice} ${product.currency}</div>
            <div class="product-cta">
                <a href="product.html?id=${product.id}" class="btn-primary btn-lg" style="text-decoration: none; display: inline-block;">التفاصيل والطلب</a>
            </div>
        `;
        
        // Fade in
        setTimeout(() => {
            visualEl.style.opacity = '1';
            infoEl.style.opacity = '1';
        }, 50);
    }, 200);
}

// No Modals Needed

// CSS transitions for product display
const style = document.createElement('style');
style.textContent = `
    #productVisual, #productInfo {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
