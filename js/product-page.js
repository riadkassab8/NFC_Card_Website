import { getProductById, calculatePrice, getProductImage, getPriceBreakdown, getAllProducts } from './products.js';
import { addToCart } from './cart.js';
import { showToast, createProductVisual, createFeatureList } from './ui.js';

// State
let currentProduct = null;
let selectedOptions = {};
let quantity = 1;
let currentSelectedImage = null;

document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    
    currentProduct = getProductById(productId);
    
    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize default options
    if (currentProduct.options) {
        currentProduct.options.forEach(opt => {
            selectedOptions[opt.id] = opt.choices[0].value;
        });
    }
    
    currentSelectedImage = currentProduct.defaultImage;
    
    renderProduct();
});

function renderProduct() {
    try {
        const container = document.getElementById('productContainer');
        const price = calculatePrice(currentProduct.id, selectedOptions);
        const priceBreakdown = getPriceBreakdown(currentProduct.id, selectedOptions);
        
        document.title = `K2rty — ${currentProduct.name}`;
        
        container.innerHTML = `
            <div class="product-page-grid" style="display: grid; gap: 4rem; align-items: start; grid-template-columns: 1fr;">
                <!-- Product Visual -->
                <div style="position: sticky; top: 100px;">
                    <div style="position: relative; height: 500px; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg);">
                        ${createProductVisual({ ...currentProduct, defaultImage: currentSelectedImage })}
                    </div>
                    ${renderGallery()}
                </div>
                
                <!-- Product Info & Form -->
                <div class="product-details-content">
                    <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">${currentProduct.name}</h1>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--accent); margin-bottom: 1.5rem;">
                        ${price} ${currentProduct.currency}
                    </div>
                    
                    <p style="color: var(--text-muted); font-size: 1.125rem; line-height: 1.8; margin-bottom: 2rem;">
                        ${currentProduct.description}
                    </p>
                    
                    <div style="background: var(--accent-soft); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
                        <h3 style="font-weight: 700; margin-bottom: 1rem; font-size: 1.25rem;">المميزات:</h3>
                        <ul class="product-features" style="list-style: none; padding: 0;">
                            ${createFeatureList(currentProduct.features)}
                        </ul>
                    </div>
                    
                    <form id="addToCartForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        ${renderOptionsForm()}
                        
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">الكمية</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <button type="button" id="btnDec" style="width: 48px; height: 48px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); font-size: 1.5rem; cursor: pointer; font-weight: 700;">−</button>
                                <span id="quantityDisplay" style="font-size: 1.5rem; font-weight: 700; min-width: 40px; text-align: center;">${quantity}</span>
                                <button type="button" id="btnInc" style="width: 48px; height: 48px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); font-size: 1.5rem; cursor: pointer; font-weight: 700;">+</button>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn-primary btn-lg" style="width: 100%; margin-top: 1rem; font-size: 1.25rem; padding: 1.25rem;">
                            إضافة للسلة — ${price * quantity} ${currentProduct.currency}
                        </button>
                    </form>
                </div>
            </div>
            
            <!-- Other Products Section -->
            <div style="margin-top: 6rem; padding-top: 4rem; border-top: 1px solid var(--border);">
                <h2 style="font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: 3rem;">منتجات أخرى قد تعجبك</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                    ${renderOtherProducts()}
                </div>
            </div>
        `;
        
        // Grid style for desktop
        if (window.innerWidth >= 1024) {
            document.querySelector('.product-page-grid').style.gridTemplateColumns = '1fr 1fr';
        }
        
        attachEvents();
    } catch(err) {
        document.getElementById('productContainer').innerHTML = `<div style="color:red; font-size: 1.5rem; padding: 2rem;">Error rendering: ${err.message}<br><br>${err.stack}</div>`;
    }
}

function renderOptionsForm() {
    if (!currentProduct.options || currentProduct.options.length === 0) return '';
    
    return currentProduct.options.map(option => `
        <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">
                ${option.label}
            </label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem;">
                ${option.choices.map(choice => {
                    const isSelected = selectedOptions[option.id] === choice.value;
                    return `
                        <label style="
                            cursor: pointer;
                            border: 2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'};
                            background: ${isSelected ? 'var(--accent-soft)' : 'var(--surface)'};
                            border-radius: var(--radius-md);
                            padding: 1rem;
                            text-align: center;
                            transition: all var(--transition-fast);
                        ">
                            <input type="radio" name="opt_${option.id}" value="${choice.value}" style="display: none;" ${isSelected ? 'checked' : ''}>
                            <div style="font-weight: 600;">${choice.label}</div>
                            <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">
                                ${choice.priceModifier > 0 ? `+${choice.priceModifier} جنيه` : 'بدون إضافة'}
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

function renderOtherProducts() {
    const allProducts = getAllProducts();
    const otherProducts = allProducts.filter(p => p.id !== currentProduct.id);
    
    return otherProducts.map(product => `
        <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit; display: block; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: transform var(--transition-base), box-shadow var(--transition-base);"
           onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='var(--shadow-lg)';"
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="height: 300px; background: var(--bg); overflow: hidden; position: relative;">
                <img src="${product.defaultImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
            </div>
            <div style="padding: 1.5rem; text-align: center;">
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${product.name}</h3>
                <div style="color: var(--accent); font-weight: 700; font-size: 1.125rem;">${product.basePrice} ${product.currency}</div>
            </div>
        </a>
    `).join('');
}

function renderGallery() {
    if (!currentProduct.gallery || currentProduct.gallery.length === 0) return '';
    
    return `
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: center; flex-wrap: wrap;">
            ${currentProduct.gallery.map(img => `
                <div class="gallery-thumb" data-img="${img}" 
                     style="width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid ${currentSelectedImage === img ? 'var(--accent)' : 'var(--border)'}; cursor: pointer; transition: all 0.3s ease;">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: contain; background: var(--surface);" alt="Gallery Thumbnail">
                </div>
            `).join('')}
        </div>
    `;
}

function attachEvents() {
    // Quantity logic
    document.getElementById('btnInc').addEventListener('click', () => {
        quantity++;
        renderProduct(); // re-render to update price
    });
    
    document.getElementById('btnDec').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            renderProduct();
        }
    });
    
    // Options logic
    if (currentProduct.options) {
        currentProduct.options.forEach(option => {
            const inputs = document.querySelectorAll(`input[name="opt_${option.id}"]`);
            inputs.forEach(input => {
                input.addEventListener('change', (e) => {
                    selectedOptions[option.id] = e.target.value;
                    renderProduct();
                });
            });
        });
    }
    
    // Add to cart
    document.getElementById('addToCartForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addToCart(currentProduct.id, quantity, selectedOptions);
        showToast('تمت الإضافة إلى السلة بنجاح!');
        // Optional: redirect to cart or just update badge
    });
    
    // Gallery logic
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            currentSelectedImage = e.currentTarget.dataset.img;
            renderProduct();
        });
    });
}
