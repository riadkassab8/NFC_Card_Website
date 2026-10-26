import { getApiBaseUrl } from './cms.js';

const DEFAULT_PRODUCTS = [
    {
        id: 'sticker',
        name: 'كوستر K2rty للتقييمات',
        description: 'كوستر NFC وQR مخصص لفتح تقييمات جوجل لمتجرك أو عملك. ثبّته على واجهة محلك أو مكتبك — واجعل عملائك يقيّموك بلمسة واحدة.',
        basePrice: 650,
        currency: 'جنيه',
        features: [
            'مخصص لتقييمات جوجل Google Reviews',
            'يعمل بتقنية NFC وQR معًا',
            'بدون تطبيق — أي هاتف حديث يكفي',
            'مقاوم للاستخدام اليومي',
            'ثلاث ألوان تناسب هويتك',
            'سهولة التركيب على أي سطح'
        ],
        options: [
            {
                id: 'color',
                label: 'اللون',
                required: true,
                choices: [
                    { value: 'white', label: 'أبيض', priceModifier: 0, image: 'https://res.cloudinary.com/dls8ootj3/image/upload/v1792525351/k2rty/k2rty_sticker_white.png' },
                    { value: 'black', label: 'أسود', priceModifier: 0, image: 'https://res.cloudinary.com/dls8ootj3/image/upload/v1792525357/k2rty/k2rty_sticker_black.png' },
                    { value: 'sage', label: 'زيتي', priceModifier: 0, image: 'https://res.cloudinary.com/dls8ootj3/image/upload/v1792525358/k2rty/k2rty_sticker_sage.jpg' }
                ]
            },
            {
                id: 'custom_print',
                label: 'هل تريد طباعة مخصصة؟',
                required: true,
                choices: [
                    { value: 'no', label: 'لا، التصميم الافتراضي', priceModifier: 0, description: 'استخدام التصميم الجاهز بدون طباعة مخصصة' },
                    { value: 'yes', label: 'نعم، طباعة مخصصة', priceModifier: 150, description: 'إضافة شعار أو تصميم خاص (شعار المحل، الاسم، إلخ)' }
                ]
            }
        ],
        visualType: 'sticker',
        defaultImage: 'https://res.cloudinary.com/dls8ootj3/image/upload/v1792525351/k2rty/k2rty_sticker_white.png',
        gallery: [
            'https://res.cloudinary.com/dls8ootj3/image/upload/v1792525351/k2rty/k2rty_sticker_white.png',
            'https://res.cloudinary.com/dls8ootj3/image/upload/v1792525357/k2rty/k2rty_sticker_black.png',
            'https://res.cloudinary.com/dls8ootj3/image/upload/v1792525358/k2rty/k2rty_sticker_sage.jpg'
        ]
    }
];

export let products = [...DEFAULT_PRODUCTS];
const PRODUCTS_CACHE_KEY = 'k2rty_products_cache';
let syncPromise = null;
let syncedAt = 0;

function asPrice(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const cleaned = String(value ?? '').replace(/,/g, '').replace(/[^\d.-]/g, '');
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
}

function imageSource(value) {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return value.url || value.src || value.imageUrl || '';
    return '';
}

function normalizeProduct(product, index) {
    if (!product || typeof product !== 'object') return null;

    const id = product.productId ?? product.id ?? product._id ?? product.slug ?? `product-${index + 1}`;
    const rawImages = Array.isArray(product.gallery) ? product.gallery : (Array.isArray(product.images) ? product.images : []);
    const gallery = rawImages.map(imageSource).filter(Boolean);
    const rawOptions = Array.isArray(product.options) ? product.options : [];
    const options = rawOptions.map((option, optionIndex) => {
        if (!option || typeof option !== 'object') return null;
        const choices = Array.isArray(option.choices) ? option.choices : (Array.isArray(option.values) ? option.values : []);
        return {
            ...option,
            id: String(option.id ?? option.optionId ?? `option-${optionIndex + 1}`),
            label: option.label || option.name || 'الخيار',
            choices: choices.map((choice, choiceIndex) => {
                if (typeof choice !== 'object' || choice === null) {
                    return { value: String(choice), label: String(choice), priceModifier: 0 };
                }
                const value = choice.value ?? choice.id ?? choice.name ?? choice.label ?? `choice-${choiceIndex + 1}`;
                return {
                    ...choice,
                    value: String(value),
                    label: choice.label || choice.name || String(value),
                    priceModifier: asPrice(choice.priceModifier ?? choice.additionalPrice ?? 0),
                    image: imageSource(choice.image) || choice.imageUrl || undefined
                };
            })
        };
    }).filter((option) => option && option.choices.length > 0);

    const defaultImage = imageSource(product.defaultImage) || imageSource(product.image) || product.imageUrl || product.thumbnail || gallery[0] || '';
    const category = typeof product.category === 'object' && product.category !== null
        ? (product.category.name || product.category.title || '')
        : (product.category || product.categoryName || '');

    return {
        ...product,
        id: String(id),
        productId: product.productId ?? String(id),
        name: product.name || product.title || 'منتج K2rty',
        description: product.description || product.shortDescription || '',
        basePrice: asPrice(product.basePrice ?? product.price ?? product.salePrice ?? product.amount),
        currency: product.currency || product.currencyCode || 'جنيه',
        category,
        features: Array.isArray(product.features) ? product.features : [],
        options,
        defaultImage,
        gallery: gallery.length ? gallery : (defaultImage ? [defaultImage] : [])
    };
}

function extractProductList(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return null;
    if (Array.isArray(payload.products)) return payload.products;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.data?.products)) return payload.data.products;
    if (Array.isArray(payload.result?.products)) return payload.result.products;
    return null;
}

function readCachedProducts() {
    try {
        const cached = JSON.parse(localStorage.getItem(PRODUCTS_CACHE_KEY) || 'null');
        const list = extractProductList(cached);
        return list ? list.map(normalizeProduct).filter(Boolean) : null;
    } catch (_) {
        return null;
    }
}

// Fetch products managed by the dashboard; keep the last successful catalog for offline use.
export function syncLiveProducts({ force = false } = {}) {
    if (syncPromise) return syncPromise;
    if (!force && syncedAt && Date.now() - syncedAt < 30000) return Promise.resolve(products);

    syncPromise = (async () => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 9000);
        try {
            const response = await fetch(`${getApiBaseUrl()}/website/products`, {
                headers: { Accept: 'application/json' },
                signal: controller.signal
            });
            if (!response.ok) throw new Error(`Products API returned ${response.status}`);

            const payload = await response.json();
            const serverProducts = extractProductList(payload);
            if (!serverProducts) throw new Error('Products API response did not contain a product list');

            products = serverProducts.map(normalizeProduct).filter(Boolean);
            try {
                localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));
            } catch (_) {}
            syncedAt = Date.now();
            return products;
        } catch (error) {
            const cached = readCachedProducts();
            products = cached ?? [...DEFAULT_PRODUCTS];
            syncedAt = Date.now();
            if (error?.name !== 'AbortError') {
                console.warn('Could not sync dashboard products; using cached/default products:', error.message);
            }
            return products;
        } finally {
            window.clearTimeout(timeout);
            syncPromise = null;
        }
    })();

    return syncPromise;
}

// Start a non-blocking refresh for pages that import the shared catalog.
syncLiveProducts();

export function getProductById(id) {
    return products.find((product) => String(product.id) === String(id) || String(product.productId) === String(id));
}

export function getAllProducts() {
    return products;
}

export function getDefaultProduct() {
    return products[0] || null;
}

export function calculatePrice(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return 0;

    return (product.options || []).reduce((total, option) => {
        const selectedValue = selectedOptions[option.id];
        const choice = (option.choices || []).find((item) => String(item.value) === String(selectedValue));
        return total + (choice ? asPrice(choice.priceModifier) : 0);
    }, asPrice(product.basePrice));
}

export function getProductImage(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return '';

    for (const option of product.options || []) {
        const selectedValue = selectedOptions[option.id];
        const choice = (option.choices || []).find((item) => String(item.value) === String(selectedValue));
        if (choice?.image) return choice.image;
    }

    return product.defaultImage || product.gallery?.[0] || '';
}

export function formatPrice(price, currency = 'جنيه') {
    return `${asPrice(price)} ${currency}`;
}

export function getOptionLabel(productId, optionId, value) {
    const option = getProductById(productId)?.options?.find((item) => item.id === optionId);
    const choice = option?.choices?.find((item) => String(item.value) === String(value));
    return choice ? choice.label : value;
}

export function getPriceBreakdown(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return null;

    const breakdown = { basePrice: asPrice(product.basePrice), additions: [], total: asPrice(product.basePrice) };
    for (const option of product.options || []) {
        const selectedValue = selectedOptions[option.id];
        const choice = (option.choices || []).find((item) => String(item.value) === String(selectedValue));
        const addition = choice ? asPrice(choice.priceModifier) : 0;
        if (addition > 0) {
            breakdown.additions.push({ label: `${option.label}: ${choice.label}`, price: addition });
            breakdown.total += addition;
        }
    }
    return breakdown;
}
