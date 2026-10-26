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

let products = [...DEFAULT_PRODUCTS];

function asPrice(value) {
    const normalized = String(value ?? '').replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[٬,\s]/g, '');
    const match = normalized.match(/-?\d+(?:\.\d+)?/);
    const price = typeof value === 'number' ? value : Number(match?.[0] ?? 0);
    return Number.isFinite(price) ? price : 0;
}

function normalizeProduct(product) {
    if (!product || typeof product !== 'object') return null;
    const id = product.productId ?? product.id;
    if (id === undefined || id === null || String(id).trim() === '') return null;
    return {
        ...product,
        id: String(id),
        productId: product.productId ?? String(id),
        basePrice: asPrice(product.basePrice ?? product.price ?? 0),
        currency: product.currency || product.currencyCode || 'جنيه'
    };
}

function extractProductList(payload) {
    if (Array.isArray(payload)) return payload;
    const candidates = [payload?.products, payload?.data?.products, payload?.data, payload?.items, payload?.data?.items];
    return candidates.find(Array.isArray) || null;
}

function useCachedProducts() {
    try {
        const cached = JSON.parse(localStorage.getItem('k2rty_products_cache') || 'null');
        if (Array.isArray(cached) && cached.length) {
            const normalized = cached.map(normalizeProduct).filter(Boolean);
            if (normalized.length) products = normalized;
        }
    } catch (error) {
        console.warn('Cached products could not be loaded:', error);
    }
}

let productsSyncPromise = null;

// Load live products from backend API
export async function syncLiveProducts() {
    if (productsSyncPromise) return productsSyncPromise;

    productsSyncPromise = (async () => {
        try {
            const response = await fetch(`${getApiBaseUrl()}/website/products`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                cache: 'no-store'
            });
            if (!response.ok) throw new Error(`Products API returned ${response.status}`);

            const payload = await response.json();
            const serverProducts = extractProductList(payload);
            if (serverProducts?.length) {
                const normalized = serverProducts.map(normalizeProduct).filter(Boolean);
                if (normalized.length) {
                    products = normalized;
                    try {
                        localStorage.setItem('k2rty_products_cache', JSON.stringify(products));
                    } catch (cacheError) {
                        console.warn('Products loaded but could not be cached:', cacheError);
                    }
                    return products;
                }
            }
        } catch (error) {
            console.warn('Live products sync failed; using cached/default products:', error);
        }

        useCachedProducts();
        return products;
    })();

    try {
        return await productsSyncPromise;
    } finally {
        productsSyncPromise = null;
    }
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
