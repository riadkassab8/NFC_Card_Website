import { getProductById, getDefaultProduct, calculatePrice, getProductImage } from './products.js';
import { addToCart } from './cart.js';
import { showToast, createFeatureList } from './ui.js';

let currentProduct = null;
let selectedOptions = {};
let quantity = 1;
let currentSelectedImage = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || getDefaultProduct().id;

    currentProduct = getProductById(productId) || getDefaultProduct();

    if (currentProduct.options) {
        currentProduct.options.forEach(opt => {
            selectedOptions[opt.id] = opt.choices[0].value;
        });
    }

    currentSelectedImage = getProductImage(currentProduct.id, selectedOptions) || currentProduct.defaultImage;
    renderProduct();
});

function renderProduct() {
    const container = document.getElementById('productContainer');
    const price = calculatePrice(currentProduct.id, selectedOptions);
    const image = getProductImage(currentProduct.id, selectedOptions) || currentSelectedImage;

    document.title = `K2rty — ${currentProduct.name}`;

    container.innerHTML = `
        <div class="product-page-grid">
            <div class="product-visual-col">
                <div class="product-stage">
                    <img src="${image}" alt="${currentProduct.name}">
                </div>
                ${renderGallery()}
            </div>
            <div>
                <div class="eyebrow">YOUR WORLD IN ONE TAP</div>
                <h1 class="section-title">${currentProduct.name}</h1>
                <div class="price-row">${price} ${currentProduct.currency}</div>
                <p style="color: var(--muted); font-size: 1.08rem; margin-bottom: 0.5rem;">${currentProduct.description}</p>
                <ul class="features product-features">${createFeatureList(currentProduct.features)}</ul>
                <form id="addToCartForm" style="display:flex;flex-direction:column;gap:1.4rem;">
                    ${renderOptionsForm()}
                    <div>
                        <label style="display:block;font-weight:700;margin-bottom:0.6rem;">الكمية</label>
                        <div class="qty-row">
                            <button type="button" id="btnDec">−</button>
                            <span id="quantityDisplay" style="font-size:1.3rem;font-weight:800;min-width:32px;text-align:center;">${quantity}</span>
                            <button type="button" id="btnInc">+</button>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary btn-lg" style="width:100%;">
                        أضف للسلة — ${price * quantity} ${currentProduct.currency}
                    </button>
                </form>
            </div>
        </div>
    `;

    attachEvents();
}

function renderOptionsForm() {
    if (!currentProduct.options?.length) return '';

    return currentProduct.options.map(option => `
        <div>
            <label style="display:block;font-weight:700;margin-bottom:0.6rem;">${option.label}</label>
            <div class="option-grid">
                ${option.choices.map(choice => {
                    const isSelected = selectedOptions[option.id] === choice.value;
                    return `
                        <label class="option-choice ${isSelected ? 'is-selected' : ''}">
                            <input type="radio" name="opt_${option.id}" value="${choice.value}" ${isSelected ? 'checked' : ''} hidden>
                            <div>${choice.label}</div>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

function renderGallery() {
    if (!currentProduct.gallery?.length) return '';

    const active = getProductImage(currentProduct.id, selectedOptions);

    return `
        <div class="gallery">
            ${currentProduct.gallery.map(img => `
                <button type="button" class="gallery-thumb ${active === img ? 'is-active' : ''}" data-img="${img}">
                    <img src="${img}" alt="">
                </button>
            `).join('')}
        </div>
    `;
}

function attachEvents() {
    document.getElementById('btnInc').addEventListener('click', () => {
        quantity++;
        renderProduct();
    });

    document.getElementById('btnDec').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            renderProduct();
        }
    });

    currentProduct.options?.forEach(option => {
        document.querySelectorAll(`input[name="opt_${option.id}"]`).forEach(input => {
            input.addEventListener('change', (e) => {
                selectedOptions[option.id] = e.target.value;
                currentSelectedImage = getProductImage(currentProduct.id, selectedOptions);
                renderProduct();
            });
        });
    });

    document.getElementById('addToCartForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addToCart(currentProduct.id, quantity, { ...selectedOptions });
        if (window.matchMedia('(max-width: 767px)').matches) {
            window.location.href = 'checkout.html';
            return;
        }
        showToast('تمت الإضافة إلى السلة');
    });

    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const img = thumb.dataset.img;
            currentSelectedImage = img;
            const colorOption = currentProduct.options.find(o => o.id === 'color');
            const match = colorOption?.choices.find(c => c.image === img);
            if (match) selectedOptions.color = match.value;
            renderProduct();
        });
    });
}
