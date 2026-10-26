import { getProductById, getDefaultProduct, calculatePrice, getProductImage, syncLiveProducts } from './products.js';
import { addToCart } from './cart.js';
import { createFeatureList } from './ui.js';

let currentProduct = null;
let selectedOptions = {};
let quantity = 1;
let currentSelectedImage = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch live products from backend
    try {
        await syncLiveProducts();
    } catch (_) {}

    const urlParams = new URLSearchParams(window.location.search);
    const defaultProduct = getDefaultProduct();
    const productId = urlParams.get('id') || defaultProduct?.id;

    currentProduct = getProductById(productId) || defaultProduct;
    if (!currentProduct) {
        document.getElementById('productContainer').innerHTML = `
            <div class="page-hero">
                <h1>لا توجد منتجات متاحة الآن</h1>
                <p>يتم تحديث المجموعة حاليًا. تفضل بزيارة صفحة المنتجات لاحقًا.</p>
                <a class="btn-primary" href="products.html">العودة إلى المنتجات</a>
            </div>
        `;
        return;
    }

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
                    <button type="submit" class="btn-primary btn-lg" style="width:100%;cursor:pointer;">
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
        
        if (window.Swal) {
            window.Swal.fire({
                icon: 'success',
                title: 'تمت الإضافة إلى السلة بنجاح!',
                html: `<p style="font-size:1rem;color:#475569;">${currentProduct.name} (الكمية: ${quantity})</p>`,
                showCancelButton: true,
                confirmButtonText: 'إتمام الطلب الآن',
                cancelButtonText: 'متابعة التسوق',
                confirmButtonColor: '#0284c7',
                cancelButtonColor: '#64748b',
                customClass: { popup: 'swal2-rtl' }
            }).then((res) => {
                if (res.isConfirmed) {
                    window.location.href = 'checkout.html';
                }
            });
        } else {
            window.location.href = 'cart.html';
        }
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
