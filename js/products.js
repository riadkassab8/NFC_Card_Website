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

// Load live products from backend API
export async function syncLiveProducts() {
    // Temporarily disabled to use local data
    // Clear cache to force reload with new data
    localStorage.removeItem("k2rty_products_cache");
    
    // Always use local products for now
    return products;
    
    /* Disabled API sync
    try {
        const url = `${getApiBaseUrl()}/website/products`;
        const res = await fetch(url);
        if (res.ok) {
            const serverProducts = await res.json();
            if (Array.isArray(serverProducts) && serverProducts.length > 0) {
                products = serverProducts.map(p => ({
                    ...p,
                    id: p.productId || p.id,
                }));
                localStorage.setItem("k2rty_products_cache", JSON.stringify(products));
            }
        }
    } catch (e) {
        // use cached or fallback
        try {
            const cached = localStorage.getItem("k2rty_products_cache");
            if (cached) {
                products = JSON.parse(cached);
            }
        } catch (_) {}
    }
    return products;
    */
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
