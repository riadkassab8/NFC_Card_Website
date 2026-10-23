import { getApiBaseUrl } from './cms.js';

export let products = [
    {
        id: "sticker",
        name: "كوستر K2rty للتقييمات",
        description: "كوستر NFC وQR مخصص لفتح تقييمات جوجل لمتجرك أو عملك. ثبّته على واجهة محلك أو مكتبك — واجعل عملائك يقيّموك بلمسة واحدة.",
        basePrice: 650,
        currency: "جنيه",
        features: [
            "مخصص لتقييمات جوجل Google Reviews",
            "يعمل بتقنية NFC وQR معًا",
            "بدون تطبيق — أي هاتف حديث يكفي",
            "مقاوم للاستخدام اليومي",
            "ثلاث ألوان تناسب هويتك",
            "سهولة التركيب على أي سطح"
        ],
        options: [
            {
                id: "color",
                label: "اللون",
                required: true,
                choices: [
                    {
                        value: "white",
                        label: "أبيض",
                        priceModifier: 0,
                        image: "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525351/k2rty/k2rty_sticker_white.png"
                    },
                    {
                        value: "black",
                        label: "أسود",
                        priceModifier: 0,
                        image: "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525357/k2rty/k2rty_sticker_black.png"
                    },
                    {
                        value: "sage",
                        label: "زيتي",
                        priceModifier: 0,
                        image: "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525358/k2rty/k2rty_sticker_sage.jpg"
                    }
                ]
            },
            {
                id: "custom_print",
                label: "هل تريد طباعة مخصصة؟",
                required: true,
                choices: [
                    {
                        value: "no",
                        label: "لا، التصميم الافتراضي",
                        priceModifier: 0,
                        description: "استخدام التصميم الجاهز بدون طباعة مخصصة"
                    },
                    {
                        value: "yes",
                        label: "نعم، طباعة مخصصة",
                        priceModifier: 150,
                        description: "إضافة شعار أو تصميم خاص (شعار المحل، الاسم، إلخ)"
                    }
                ]
            }
        ],
        visualType: "sticker",
        defaultImage: "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525351/k2rty/k2rty_sticker_white.png",
        gallery: [
            "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525351/k2rty/k2rty_sticker_white.png",
            "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525357/k2rty/k2rty_sticker_black.png",
            "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525358/k2rty/k2rty_sticker_sage.jpg"
        ]
    }
];

// Load live products from backend API
export async function syncLiveProducts() {
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
                localStorage.setItem('k2rty_products_cache', JSON.stringify(products));
                return products;
            }
        }
    } catch (_) {
        try {
            const cached = localStorage.getItem('k2rty_products_cache');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && !parsed.some(p => p.id === 'sticker' && p.basePrice < 650)) {
                    products = parsed;
                } else {
                    localStorage.removeItem('k2rty_products_cache');
                }
            }
        } catch (__) {}
    }
    return products;
}

// Auto-sync products
syncLiveProducts();

export function getProductById(id) {
    return products.find(p => p.id === id || p.productId === id);
}

export function getAllProducts() {
    return products;
}

export function getDefaultProduct() {
    return products[0];
}

export function calculatePrice(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return 0;

    let totalPrice = product.basePrice;

    if (product.options && Array.isArray(product.options)) {
        product.options.forEach(option => {
            const selectedValue = selectedOptions[option.id];
            if (selectedValue) {
                const choice = option.choices.find(c => c.value === selectedValue);
                if (choice && choice.priceModifier) {
                    totalPrice += choice.priceModifier;
                }
            }
        });
    }

    return totalPrice;
}

export function getProductImage(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return '';

    if (product.options && Array.isArray(product.options)) {
        for (const option of product.options) {
            const selectedValue = selectedOptions[option.id];
            if (selectedValue) {
                const choice = option.choices.find(c => c.value === selectedValue);
                if (choice && choice.image) {
                    return choice.image;
                }
            }
        }
    }

    return product.defaultImage || '';
}

export function formatPrice(price, currency = "جنيه") {
    return `${price} ${currency}`;
}

export function getOptionLabel(productId, optionId, value) {
    const product = getProductById(productId);
    if (!product) return value;
    const option = product.options.find(o => o.id === optionId);
    if (!option) return value;
    const choice = option.choices.find(c => c.value === value);
    return choice ? choice.label : value;
}

export function getPriceBreakdown(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return null;

    const breakdown = {
        basePrice: product.basePrice,
        additions: [],
        total: product.basePrice
    };

    if (product.options && Array.isArray(product.options)) {
        product.options.forEach(option => {
            const selectedValue = selectedOptions[option.id];
            if (selectedValue) {
                const choice = option.choices.find(c => c.value === selectedValue);
                if (choice && choice.priceModifier > 0) {
                    breakdown.additions.push({
                        label: `${option.label}: ${choice.label}`,
                        price: choice.priceModifier
                    });
                    breakdown.total += choice.priceModifier;
                }
            }
        });
    }

    return breakdown;
}
