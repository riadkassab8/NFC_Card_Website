export const products = [
    {
        id: "sticker",
        name: "كوستر K2rty الذكي",
        description: "كوستر NFC وQR بتصميم احترافي. ثبّته على هاتفك، مكتبك، أو واجهة محلك — وعالمك كله يبقى في لمسة واحدة.",
        basePrice: 450,
        currency: "جنيه",
        features: [
            "يعمل بتقنية NFC وQR معًا",
            "بدون تطبيق — أي هاتف حديث يكفي",
            "مقاوم للاستخدام اليومي",
            "ثلاث ألوان تناسب هويتك",
            "جاهز للربط بروابطك وبياناتك"
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
                        image: "assets/images/product/sticker-white.png"
                    },
                    {
                        value: "black",
                        label: "أسود",
                        priceModifier: 0,
                        image: "assets/images/product/sticker-black.png"
                    },
                    {
                        value: "sage",
                        label: "زيتي",
                        priceModifier: 0,
                        image: "assets/images/product/sticker-sage.jpg"
                    }
                ]
            }
        ],
        visualType: "sticker",
        defaultImage: "assets/images/product/sticker-white.png",
        gallery: [
            "assets/images/product/sticker-white.png",
            "assets/images/product/sticker-black.png",
            "assets/images/product/sticker-sage.jpg"
        ]
    }
];

export function getProductById(id) {
    return products.find(p => p.id === id);
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

    product.options.forEach(option => {
        const selectedValue = selectedOptions[option.id];
        if (selectedValue) {
            const choice = option.choices.find(c => c.value === selectedValue);
            if (choice && choice.priceModifier) {
                totalPrice += choice.priceModifier;
            }
        }
    });

    return totalPrice;
}

export function getProductImage(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return '';

    for (const option of product.options) {
        const selectedValue = selectedOptions[option.id];
        if (selectedValue) {
            const choice = option.choices.find(c => c.value === selectedValue);
            if (choice && choice.image) {
                return choice.image;
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

    return breakdown;
}
