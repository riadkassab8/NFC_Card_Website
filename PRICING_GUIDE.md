# دليل نظام التسعير الديناميكي — K2rty

## 📊 كيف يعمل نظام التسعير؟

K2rty يدعم **تسعير ديناميكي** يتغير حسب اختيارات العميل.

---

## 🏗️ هيكل التسعير

### 1. السعر الأساسي (Base Price)
كل منتج له سعر أساسي (starting price):

```javascript
{
    id: "card",
    name: "بطاقة",
    basePrice: 199,  // ← السعر الأساسي
    currency: "جنيه"
}
```

### 2. معدل السعر (Price Modifier)
كل خيار (option) يمكن أن يضيف للسعر:

```javascript
options: [
    {
        id: "material",
        label: "المادة",
        choices: [
            { 
                value: "plastic", 
                label: "بلاستيك", 
                priceModifier: 0      // ← لا زيادة
            },
            { 
                value: "metal", 
                label: "معدن", 
                priceModifier: 150    // ← زيادة 150 جنيه
            }
        ]
    }
]
```

### 3. السعر النهائي
```
السعر النهائي = السعر الأساسي + مجموع معدلات السعر
```

---

## 💰 أمثلة عملية

### مثال 1: بطاقة بلاستيك بدون حفر
```
السعر الأساسي:    199 جنيه
المادة (بلاستيك): +0 جنيه
الحفر (بدون):      +0 جنيه
―――――――――――――――――――――――――――
الإجمالي:         199 جنيه
```

### مثال 2: بطاقة معدن مع حفر اسم
```
السعر الأساسي:    199 جنيه
المادة (معدن):     +150 جنيه
الحفر (اسم مخصص): +100 جنيه
―――――――――――――――――――――――――――
الإجمالي:         449 جنيه
```

### مثال 3: استاند كبير بقاعدة معدن
```
السعر الأساسي:    399 جنيه
الحجم (كبير):      +200 جنيه
القاعدة (معدن):    +150 جنيه
―――――――――――――――――――――――――――
الإجمالي:         749 جنيه
```

---

## ⚙️ كيفية تعديل الأسعار

### الموقع:
**ملف:** `js/products.js`

### 1. تغيير السعر الأساسي:
```javascript
{
    id: "card",
    name: "بطاقة",
    basePrice: 250,  // ← غيّر هنا
    // ...
}
```

### 2. تغيير معدل سعر خيار:
```javascript
{
    id: "material",
    label: "المادة",
    choices: [
        { 
            value: "plastic", 
            label: "بلاستيك", 
            priceModifier: 0      // ← غيّر هنا
        },
        { 
            value: "metal", 
            label: "معدن", 
            priceModifier: 200    // ← غيّر هنا (كان 150)
        }
    ]
}
```

### 3. إضافة خيار جديد بسعر:
```javascript
{
    id: "color",
    label: "اللون",
    choices: [
        { value: "black", label: "أسود", priceModifier: 0 },
        { value: "gold", label: "ذهبي", priceModifier: 100 }  // ← جديد
    ]
}
```

---

## 📋 جدول الأسعار الحالية

### منتج: ميداليا
| الخيار | القيمة | السعر الإضافي |
|--------|--------|---------------|
| **السعر الأساسي** | - | **299 جنيه** |
| اللون | أسود | +0 |
| اللون | أبيض | +0 |
| اللون | رمادي | +0 |
| النوع | مات | +0 |
| النوع | لامع | +50 |

**أقل سعر:** 299 جنيه (أي لون + مات)  
**أعلى سعر:** 349 جنيه (أي لون + لامع)

---

### منتج: بطاقة
| الخيار | القيمة | السعر الإضافي |
|--------|--------|---------------|
| **السعر الأساسي** | - | **199 جنيه** |
| المادة | بلاستيك | +0 |
| المادة | معدن | +150 |
| الحفر | بدون | +0 |
| الحفر | اسم مخصص | +100 |

**أقل سعر:** 199 جنيه (بلاستيك + بدون حفر)  
**أعلى سعر:** 449 جنيه (معدن + اسم مخصص)

---

### منتج: استاند
| الخيار | القيمة | السعر الإضافي |
|--------|--------|---------------|
| **السعر الأساسي** | - | **399 جنيه** |
| الحجم | صغير | +0 |
| الحجم | متوسط | +100 |
| الحجم | كبير | +200 |
| القاعدة | خشب | +0 |
| القاعدة | معدن | +150 |

**أقل سعر:** 399 جنيه (صغير + خشب)  
**أعلى سعر:** 749 جنيه (كبير + معدن)

---

## 🎯 أين يظهر السعر؟

### 1. صفحة المنتجات (Product Showcase)
```
"يبدأ من XXX جنيه"
```
يعرض السعر الأساسي فقط.

### 2. Order Builder - Step 3 (التخصيص)
```
السعر الحالي: XXX جنيه

تفاصيل السعر:
السعر الأساسي: 199 جنيه
+ المادة: معدن: 150 جنيه
+ الحفر: اسم مخصص: 100 جنيه
―――――――――――――――――――――――
الإجمالي: 449 جنيه
```
يعرض السعر الديناميكي مع التفاصيل.

### 3. Order Summary (الملخص)
```
بطاقة × 2
449 × 2 = 898 جنيه

الإجمالي الكلي: 898 جنيه
```
يحسب السعر × الكمية.

---

## 🔄 التحديث الديناميكي

### متى يتم إعادة حساب السعر؟
1. **عند اختيار خيار جديد** في Step 3
2. **عند تغيير الكمية** في Step 2
3. **في الملخص النهائي** قبل الإرسال

### كيف يعمل؟
```javascript
// التحديث تلقائي عند تغيير أي خيار
window.updateOption = function(itemIndex, optionId, value) {
    orderState.items[itemIndex].options[optionId] = value;
    
    // إعادة حساب السعر
    const item = orderState.items[itemIndex];
    item.price = calculatePrice(item.productId, item.options);
    
    renderStep(); // إعادة رسم الصفحة لعرض السعر الجديد
};
```

---

## 💡 استراتيجيات التسعير

### 1. تسعير متدرج (Good-Better-Best)
```javascript
// صغير = Good
{ value: "small", label: "صغير", priceModifier: 0 }

// متوسط = Better
{ value: "medium", label: "متوسط", priceModifier: 100 }

// كبير = Best
{ value: "large", label: "كبير", priceModifier: 200 }
```

### 2. تسعير Premium
```javascript
// خيارات عادية = مجانية
{ value: "plastic", label: "بلاستيك", priceModifier: 0 }

// خيارات premium = إضافة كبيرة
{ value: "metal", label: "معدن", priceModifier: 150 }
```

### 3. تسعير الخدمات الإضافية
```javascript
// بدون خدمة = مجاني
{ value: "none", label: "بدون", priceModifier: 0 }

// مع خدمة = زيادة
{ value: "custom", label: "حفر مخصص", priceModifier: 100 }
```

---

## 🧮 حسابات متقدمة

### احتساب الربح:
```javascript
const cost = 120;              // تكلفة المنتج
const basePrice = 199;         // السعر الأساسي
const profit = basePrice - cost; // = 79 جنيه (39% هامش ربح)
```

### احتساب الخصم:
```javascript
// يمكنك إضافة نظام خصومات لاحقًا:
const originalPrice = calculatePrice(productId, options);
const discount = 0.10; // 10%
const finalPrice = originalPrice * (1 - discount);
```

### احتساب الكمية:
```javascript
const unitPrice = 449;
const quantity = 3;
const subtotal = unitPrice * quantity; // = 1347 جنيه
```

---

## 📊 تتبع الإيرادات

### في Order Object:
```javascript
{
    items: [
        {
            productId: "card",
            productName: "بطاقة",
            quantity: 2,
            options: {
                material: "metal",
                engraving: "name"
            },
            price: 449  // ← السعر لكل قطعة
        }
    ]
}
```

### حساب الإيرادات:
```javascript
const revenue = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
}, 0);
```

---

## 🎨 عرض السعر في UI

### في Product Showcase:
```html
<div class="product-price">يبدأ من 199 جنيه</div>
```

### في Order Builder (مع تفصيل):
```html
<div style="font-weight: 700; color: var(--accent);">
    449 جنيه
</div>

<div style="font-size: 0.875rem; color: var(--text-muted);">
    السعر الأساسي: 199 جنيه
    + معدن: 150 جنيه
    + حفر: 100 جنيه
</div>
```

### في Order Summary:
```html
<div style="display: flex; justify-content: space-between;">
    <span>بطاقة × 2</span>
    <span style="font-weight: 700;">898 جنيه</span>
</div>
```

---

## ✅ Checklist التسعير

قبل الإطلاق:
- [ ] السعر الأساسي لكل منتج محدد
- [ ] معدلات الأسعار لكل خيار محددة
- [ ] الأسعار تغطي التكلفة + هامش ربح
- [ ] السعر يتحدث ديناميكيًا في Order Builder
- [ ] الإجمالي يحسب بشكل صحيح
- [ ] السعر × الكمية يعمل
- [ ] التفاصيل تظهر بوضوح للعميل

---

## 🔮 تحسينات مستقبلية

يمكنك إضافة لاحقًا:
- **كوبونات خصم** (discount codes)
- **عروض خاصة** (bundle deals)
- **تسعير الجملة** (bulk pricing)
- **شحن متغير** (dynamic shipping)
- **ضريبة** (tax calculation)
- **عملات متعددة** (multi-currency)

---

**نظام التسعير جاهز وقابل للتوسع!** 💰
