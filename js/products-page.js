import { syncLiveProducts, getAllProducts, formatPrice } from './products.js';

const grid = document.getElementById('productsGrid');
const searchInput = document.getElementById('productSearch');
const categoryList = document.getElementById('productCategories');
const sortSelect = document.getElementById('productSort');
const countLabel = document.getElementById('productCount');
const emptyState = document.getElementById('productsEmpty');

let activeCategory = 'all';
let query = '';
let products = [];

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

function productCategory(product) {
    const category = product.category || product.categoryName || product.category?.name;
    return typeof category === 'string' && category.trim() ? category.trim() : 'منتجات K2rty';
}

function renderCategories() {
    const categories = [...new Set(products.map(productCategory))];
    const choices = [{ value: 'all', label: 'كل المنتجات' }, ...categories.map((label) => ({ value: label, label }))];

    categoryList.innerHTML = choices.map(({ value, label }) => `
        <button class="catalog-chip ${activeCategory === value ? 'is-active' : ''}"
            type="button" data-category="${escapeHtml(value)}" aria-pressed="${activeCategory === value}">
            ${escapeHtml(label)}
        </button>
    `).join('');

    categoryList.querySelectorAll('[data-category]').forEach((button) => {
        button.addEventListener('click', () => {
            activeCategory = button.dataset.category;
            renderCategories();
            renderProducts();
        });
    });
}

function productPrice(product) {
    const price = Number(product.basePrice ?? product.price ?? 0);
    return Number.isFinite(price) ? price : 0;
}

function cardMarkup(product, index) {
    const id = String(product.id ?? product.productId ?? '');
    const href = `product.html?id=${encodeURIComponent(id)}`;
    const image = product.defaultImage || product.imageUrl || product.image || product.gallery?.[0] || '';
    const name = product.name || product.title || 'منتج K2rty';
    const description = product.description || product.shortDescription || 'تفاصيل المنتج وخياراته في صفحة المنتج.';
    const currency = product.currency || product.currencyCode || 'جنيه';
    const price = productPrice(product);
    const category = productCategory(product);
    const features = Array.isArray(product.features) ? product.features.filter(Boolean).slice(0, 2) : [];

    return `
        <article class="catalog-card" style="--card-order:${index}">
            <a class="catalog-card-visual" href="${href}" aria-label="تفاصيل ${escapeHtml(name)}">
                ${image
                    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy" decoding="async">`
                    : '<span class="catalog-image-placeholder" aria-hidden="true">K2</span>'}
                <span class="catalog-card-badge">${escapeHtml(category)}</span>
                <span class="catalog-card-arrow" aria-hidden="true">↗</span>
            </a>
            <div class="catalog-card-body">
                <div class="catalog-card-kicker">K2RTY / ${String(index + 1).padStart(2, '0')}</div>
                <h2><a href="${href}">${escapeHtml(name)}</a></h2>
                <p class="catalog-card-description">${escapeHtml(description)}</p>
                ${features.length ? `<div class="catalog-card-features">${features.map((feature) => `<span>${escapeHtml(feature)}</span>`).join('')}</div>` : ''}
                <div class="catalog-card-bottom">
                    <div class="catalog-price-wrap">
                        <span class="catalog-price-caption">السعر يبدأ من</span>
                        <strong>${escapeHtml(formatPrice(price, currency))}</strong>
                    </div>
                    <a class="catalog-card-cta" href="${href}" aria-label="استكشف ${escapeHtml(name)}">
                        <span>استكشف المنتج</span><span aria-hidden="true">←</span>
                    </a>
                </div>
            </div>
        </article>
    `;
}

function renderProducts() {
    const normalizedQuery = query.trim().toLocaleLowerCase('ar');
    const visibleProducts = products.filter((product) => {
        const matchesCategory = activeCategory === 'all' || productCategory(product) === activeCategory;
        const searchable = [product.name, product.title, product.description, product.shortDescription, productCategory(product), ...(product.features || [])]
            .filter(Boolean).join(' ').toLocaleLowerCase('ar');
        return matchesCategory && searchable.includes(normalizedQuery);
    });

    const sortMode = sortSelect.value;
    if (sortMode === 'featured') {
        visibleProducts.sort((a, b) => Number(Boolean(b.isFeatured ?? b.featured)) - Number(Boolean(a.isFeatured ?? a.featured)));
    }
    if (sortMode === 'price-asc') visibleProducts.sort((a, b) => productPrice(a) - productPrice(b));
    if (sortMode === 'price-desc') visibleProducts.sort((a, b) => productPrice(b) - productPrice(a));
    if (sortMode === 'name') visibleProducts.sort((a, b) => String(a.name || a.title || '').localeCompare(String(b.name || b.title || ''), 'ar'));

    grid.innerHTML = visibleProducts.map(cardMarkup).join('');
    grid.setAttribute('aria-busy', 'false');
    countLabel.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'منتج' : 'منتجات'}`;
    emptyState.hidden = visibleProducts.length > 0;
    grid.hidden = visibleProducts.length === 0;
}

searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    renderProducts();
});

sortSelect.addEventListener('change', renderProducts);

(async function initCatalog() {
    try {
        await syncLiveProducts();
    } catch (error) {
        console.warn('تعذر تحديث كتالوج المنتجات؛ سيتم عرض البيانات المحفوظة.', error);
    }

    products = getAllProducts();
    renderCategories();
    renderProducts();
})();
