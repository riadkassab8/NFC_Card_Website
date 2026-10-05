// Product Data Configuration with Dynamic Pricing & Images
export const products = [
    {
        id: "physical",
        name: "ميداليا",
        description: "قطعة ميداليا مميزة مرتبطة بفكرة K2rty، تجمع بين الجودة والتصميم العصري.",
        basePrice: 299,
        currency: "جنيه",
        features: [
            "تصميم عصري ومميز",
            "جودة عالية في التصنيع",
            "قابل للتخصيص",
            "سهل الاستخدام"
        ],
        options: [
            { 
                id: "color", 
                label: "اللون", 
                required: true,
                choices: [
                    { value: "black", label: "أسود", priceModifier: 0, image: "assets/images/physical-black.jpg" },
                    { value: "white", label: "أبيض", priceModifier: 0, image: "assets/images/physical-white.jpg" },
                    { value: "gray", label: "رمادي", priceModifier: 0, image: "assets/images/physical-gray.jpg" }
                ]
            },
            { 
                id: "finish", 
                label: "النوع", 
                required: true,
                choices: [
                    { value: "matte", label: "مات", priceModifier: 0 },
                    { value: "glossy", label: "لامع", priceModifier: 50 }
                ]
            }
        ],
        visualType: "physical",
        defaultImage: "assets/images/physical-default.png",
        gallery: [
            "assets/images/physical-default.png",
            "assets/images/keychain_angle.png",
            "assets/images/keychain_lifestyle.png"
        ]
    },
    {
        id: "card",
        name: "بطاقة",
        description: "بطاقة ميداليا احترافية يمكن استخدامها كجزء من تجربة K2rty الخاصة بك.",
        basePrice: 199,
        currency: "جنيه",
        features: [
            "مادة عالية الجودة",
            "تصميم أنيق ونظيف",
            "مقاومة للماء",
            "خفيفة وسهلة الحمل"
        ],
        options: [
            { 
                id: "material", 
                label: "المادة", 
                required: true,
                choices: [
                    { value: "plastic", label: "بلاستيك", priceModifier: 0, image: "assets/images/card-plastic.jpg" },
                    { value: "metal", label: "معدن", priceModifier: 150, image: "assets/images/card-metal.jpg" }
                ]
            },
            { 
                id: "engraving", 
                label: "الحفر", 
                required: false,
                choices: [
                    { value: "none", label: "بدون", priceModifier: 0 },
                    { value: "name", label: "اسم مخصص", priceModifier: 100 }
                ]
            }
        ],
        visualType: "card",
        defaultImage: "assets/images/card-default.png",
        gallery: [
            "assets/images/card-default.png",
            "assets/images/card_angle.png",
            "assets/images/card_lifestyle.png"
        ]
    },
    {
        id: "stand",
        name: "استاند",
        description: "استاند عرض احترافي، مثالي لعرض منتجات K2rty أو استخدامه في مكتبك أو منزلك.",
        basePrice: 399,
        currency: "جنيه",
        features: [
            "تصميم قوي ومستقر",
            "مناسب لمختلف الأحجام",
            "سهل التركيب",
            "مظهر عصري واحترافي"
        ],
        options: [
            { 
                id: "size", 
                label: "الحجم", 
                required: true,
                choices: [
                    { value: "small", label: "صغير", priceModifier: 0, image: "assets/images/stand-small.jpg" },
                    { value: "medium", label: "متوسط", priceModifier: 100, image: "assets/images/stand-medium.jpg" },
                    { value: "large", label: "كبير", priceModifier: 200, image: "assets/images/stand-large.jpg" }
                ]
            },
            { 
                id: "base", 
                label: "القاعدة", 
                required: true,
                choices: [
                    { value: "wood", label: "خشب", priceModifier: 0, image: "assets/images/stand-wood-base.jpg" },
                    { value: "metal", label: "معدن", priceModifier: 150, image: "assets/images/stand-metal-base.jpg" }
                ]
            }
        ],
        visualType: "stand",
        defaultImage: "assets/images/stand-default.png",
        gallery: [
            "assets/images/stand-default.png",
            "assets/images/stand_angle.png",
            "assets/images/stand_lifestyle.png"
        ]
    }
];

// Get product by ID
export function getProductById(id) {
    return products.find(p => p.id === id);
}

// Get all products
export function getAllProducts() {
    return products;
}

// Calculate product price based on selected options
export function calculatePrice(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return 0;
    
    let totalPrice = product.basePrice;
    
    // Add price modifiers from each selected option
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

// Get product image based on selected options
export function getProductImage(productId, selectedOptions = {}) {
    const product = getProductById(productId);
    if (!product) return '';
    
    // Find the first option with an image based on selected value
    for (const option of product.options) {
        const selectedValue = selectedOptions[option.id];
        if (selectedValue) {
            const choice = option.choices.find(c => c.value === selectedValue);
            if (choice && choice.image) {
                return choice.image;
            }
        }
    }
    
    // Return default image if no option image found
    return product.defaultImage || '';
}

// Format price with currency
export function formatPrice(price, currency = "جنيه") {
    return `${price} ${currency}`;
}

// Get price breakdown for display
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
