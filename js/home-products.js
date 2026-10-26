import { getAllProducts, syncLiveProducts, formatPrice } from './products.js';

const section = document.getElementById('homeFeatured');
const card = document.getElementById('homeFeaturedCard');
const previousButton = document.getElementById('homeFeaturedPrevious');
const nextButton = document.getElementById('homeFeaturedNext');
const positionLabel = document.getElementById('homeFeaturedPosition');
const progressBar = document.getElementById('homeFeaturedProgress');

if (section && card) {
    const state = {
        products: [],
        productIndex: 0,
        imageIndex: 0,
        productTimer: null,
        imageTimer: null,
        resumeTimer: null,
        animationTimer: null,
        touchStartX: null,
        hasRenderedProducts: false
    };

    const PRODUCT_ROTATION_MS = 6500;
    const IMAGE_ROTATION_MS = 3000;

    const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));

    function imageSource(value) {
        if (typeof value === 'string') return value.trim();
        if (!value || typeof value !== 'object') return '';
        return String(value.url ?? value.src ?? value.imageUrl ?? value.image ?? value.path ?? value.secure_url ?? '').trim();
    }

    function productImages(product) {
        const candidates = [
            product.defaultImage, product.imageUrl, product.image, product.thumbnail,
            product.mainImage, product.coverImage, product.url,
            ...(Array.isArray(product.gallery) ? product.gallery : product.gallery ? [product.gallery] : []),
            ...(Array.isArray(product.images) ? product.images : []),
            ...(Array.isArray(product.imageUrls) ? product.imageUrls : []),
            ...(Array.isArray(product.photos) ? product.photos : []),
            ...(Array.isArray(product.productImages) ? product.productImages : []),
            ...(Array.isArray(product.options) ? product.options.flatMap(option =>
                (option.choices || []).map(choice => choice.image ?? choice.imageUrl ?? choice.image_url)
            ) : []),
            ...(Array.isArray(product.variants) ? product.variants.map(variant => variant.image ?? variant.imageUrl) : [])
        ];
        return [...new Set(candidates.map(imageSource).filter(Boolean))];
    }

    function featuredValue(product) {
        const value = product.isFeatured ?? product.featured ?? product.is_featured;
        return value === true || value === 1 || ['true', '1', 'yes', 'featured'].includes(String(value).toLowerCase());
    }

    function creationTime(product) {
        const value = product.createdAt ?? product.created_at ?? product.createdOn ?? product.created_on ??
            product.publishedAt ?? product.published_at ?? product.addedAt ?? product.dateCreated;
        const numeric = Number(value);
        const timestamp = typeof value === 'number' || (String(value).trim() && Number.isFinite(numeric))
            ? (numeric > 0 && numeric < 100000000000 ? numeric * 1000 : numeric)
            : (value ? Date.parse(value) : 0);
        return Number.isFinite(timestamp) ? timestamp : 0;
    }

    function orderedProducts(list) {
        return list
            .map((product, index) => ({ product, index }))
            .filter(({ product }) => product && (product.productId ?? product.id) != null)
            .sort((a, b) => {
                const featuredDifference = Number(featuredValue(b.product)) - Number(featuredValue(a.product));
                if (featuredDifference) return featuredDifference;
                const aTime = creationTime(a.product);
                const bTime = creationTime(b.product);
                if (aTime && bTime && aTime !== bTime) return bTime - aTime;
                return a.index - b.index;
            })
            .map(({ product }) => product);
    }

    function currentProduct() {
        return state.products[state.productIndex];
    }

    function renderCard(animate = false) {
        const product = currentProduct();
        if (!product) {
            section.hidden = true;
            return;
        }

        const images = productImages(product);
        const id = String(product.id ?? product.productId);
        const name = product.name || product.title || 'منتج K2rty';
        const description = product.shortDescription || product.description || 'اكتشف تفاصيل المنتج وخياراته.';
        const currency = product.currency || product.currencyCode || 'جنيه';
        const price = formatPrice(product.basePrice ?? product.price ?? 0, currency);
        const categoryValue = product.categoryName ?? product.category;
        const category = typeof categoryValue === 'string' ? categoryValue : categoryValue?.name;
        const features = Array.isArray(product.features) ? product.features.filter(Boolean).slice(0, 3) : [];
        const imageMarkup = images.length
            ? `<img id="homeFeaturedImage" src="${escapeHtml(images[state.imageIndex] || images[0])}" alt="${escapeHtml(name)}" loading="eager" decoding="async">`
            : `<div class="home-featured-placeholder" aria-label="لا توجد صورة للمنتج"><span>K2</span><small>${escapeHtml(name)}</small></div>`;
        const indicators = images.length > 1
            ? `<div class="home-featured-image-dots" role="group" aria-label="صور ${escapeHtml(name)}">${images.map((image, index) => `
                <button type="button" class="home-featured-image-dot ${index === state.imageIndex ? 'is-active' : ''}"
                    data-featured-image="${index}" aria-label="عرض الصورة ${index + 1}" aria-pressed="${index === state.imageIndex}"></button>
            `).join('')}</div>`
            : '';
        const badge = featuredValue(product) ? 'اختيار مميز' : (category || 'منتج جديد');

        card.innerHTML = `
            <div class="home-featured-layout" role="group" aria-roledescription="شريحة منتج" aria-label="${escapeHtml(name)}">
                <a class="home-featured-visual" href="product.html?id=${encodeURIComponent(id)}" aria-label="استكشف ${escapeHtml(name)}">
                    ${imageMarkup}
                    <span class="home-featured-badge">${escapeHtml(badge)}</span>
                    ${images.length > 1 ? `<span class="home-featured-image-count" id="homeFeaturedImageCount">${String(state.imageIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}</span>` : ''}
                    ${indicators}
                </a>
                <div class="home-featured-copy">
                    <div class="home-featured-kicker"><span></span> K2RTY / ${String(state.productIndex + 1).padStart(2, '0')}</div>
                    <h3>${escapeHtml(name)}</h3>
                    <p class="home-featured-description">${escapeHtml(description)}</p>
                    ${features.length ? `<ul class="home-featured-features">${features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>` : ''}
                    <div class="home-featured-bottom">
                        <div class="home-featured-price"><span>السعر يبدأ من</span><strong>${escapeHtml(price)}</strong></div>
                        <a class="home-featured-cta" href="product.html?id=${encodeURIComponent(id)}">شوف التفاصيل <span aria-hidden="true">←</span></a>
                    </div>
                </div>
            </div>
        `;

        section.hidden = false;
        window.clearTimeout(state.animationTimer);
        card.classList.remove('is-animating');
        if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            void card.offsetWidth;
            card.classList.add('is-animating');
            state.animationTimer = window.setTimeout(() => card.classList.remove('is-animating'), 850);
        }
        if (positionLabel) positionLabel.textContent = `${String(state.productIndex + 1).padStart(2, '0')} / ${String(state.products.length).padStart(2, '0')}`;
        if (progressBar) progressBar.style.setProperty('--featured-progress', `${((state.productIndex + 1) / state.products.length) * 100}%`);
    }

    function setImage(index) {
        const images = productImages(currentProduct() || {});
        if (!images.length) return;
        state.imageIndex = (index + images.length) % images.length;
        const image = document.getElementById('homeFeaturedImage');
        if (image) {
            const nextSource = images[state.imageIndex];
            if (image.getAttribute('src') === nextSource) {
                image.classList.remove('is-changing');
            } else {
                image.classList.add('is-changing');
                const finishImageChange = () => image.classList.remove('is-changing');
                image.addEventListener('load', finishImageChange, { once: true });
                image.addEventListener('error', finishImageChange, { once: true });
                image.src = nextSource;
            }
        }
        card.querySelectorAll('[data-featured-image]').forEach((dot, dotIndex) => {
            const active = dotIndex === state.imageIndex;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-pressed', String(active));
        });
        const count = document.getElementById('homeFeaturedImageCount');
        if (count) count.textContent = `${String(state.imageIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    }

    function showProduct(index, restartTimer = false) {
        if (!state.products.length) return;
        state.productIndex = (index + state.products.length) % state.products.length;
        state.imageIndex = 0;
        renderCard(true);
        if (restartTimer) restartAutoplay();
        else startAutoplay();
    }

    function stopAutoplay() {
        window.clearInterval(state.productTimer);
        window.clearInterval(state.imageTimer);
        state.productTimer = null;
        state.imageTimer = null;
    }

    function startAutoplay() {
        if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (state.products.length > 1 && !state.productTimer) {
            state.productTimer = window.setInterval(() => showProduct(state.productIndex + 1), PRODUCT_ROTATION_MS);
        }
        if (productImages(currentProduct() || {}).length > 1 && !state.imageTimer) {
            state.imageTimer = window.setInterval(() => setImage(state.imageIndex + 1), IMAGE_ROTATION_MS);
        } else if (productImages(currentProduct() || {}).length <= 1 && state.imageTimer) {
            window.clearInterval(state.imageTimer);
            state.imageTimer = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        window.clearTimeout(state.resumeTimer);
        state.resumeTimer = window.setTimeout(startAutoplay, 1000);
    }

    async function loadProducts() {
        try {
            await syncLiveProducts();
        } catch (error) {
            console.warn('تعذر تحديث منتجات الصفحة الرئيسية؛ سيتم عرض المنتجات المحفوظة.', error);
        }

        const nextProducts = orderedProducts(getAllProducts());
        const currentId = currentProduct() && String(currentProduct().id ?? currentProduct().productId);
        state.products = nextProducts;
        const preservedIndex = nextProducts.findIndex(product => String(product.id ?? product.productId) === currentId);
        state.productIndex = preservedIndex >= 0 ? preservedIndex : 0;
        state.imageIndex = 0;
        const nextId = nextProducts[state.productIndex] && String(nextProducts[state.productIndex].id ?? nextProducts[state.productIndex].productId);
        renderCard(!state.hasRenderedProducts || Boolean(currentId && currentId !== nextId));
        state.hasRenderedProducts = true;
        restartAutoplay();
    }

    previousButton?.addEventListener('click', () => showProduct(state.productIndex - 1, true));
    nextButton?.addEventListener('click', () => showProduct(state.productIndex + 1, true));

    card.addEventListener('click', event => {
        const imageButton = event.target.closest('[data-featured-image]');
        if (imageButton) {
            event.preventDefault();
            setImage(Number(imageButton.dataset.featuredImage));
            restartAutoplay();
        }
    });

    card.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch') state.touchStartX = event.clientX;
    });
    card.addEventListener('pointerup', event => {
        if (state.touchStartX === null) return;
        const distance = event.clientX - state.touchStartX;
        state.touchStartX = null;
        if (Math.abs(distance) > 55) showProduct(state.productIndex + (distance > 0 ? 1 : -1), true);
    });
    card.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') showProduct(state.productIndex + 1, true);
        if (event.key === 'ArrowRight') showProduct(state.productIndex - 1, true);
    });
    document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());

    loadProducts();
    window.setInterval(loadProducts, 60000);
}
