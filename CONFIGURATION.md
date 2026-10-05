# K2rty Configuration Guide

Complete guide for customizing K2rty without touching core functionality.

---

## 🎨 Brand & Design

### Colors
**File:** `css/styles.css` (lines 2-11)

```css
:root {
    --bg: #FAFAF9;           /* Main background color */
    --surface: #FFFFFF;      /* Cards and elevated surfaces */
    --text: #1A1A1A;         /* Primary text */
    --text-muted: #737373;   /* Secondary/muted text */
    --border: #E5E5E5;       /* Border color */
    --accent: #0F172A;       /* Primary brand color (buttons, links) */
    --accent-hover: #334155; /* Hover state for accent */
    --accent-soft: #F1F5F9;  /* Subtle accent backgrounds */
}
```

**Pro tip:** Change only `--accent` and `--accent-hover` for a quick rebrand.

### Typography
**File:** `index.html` (lines 16-17)

Current fonts:
- Arabic: Tajawal
- Latin: Inter

To change:
1. Find new fonts on [Google Fonts](https://fonts.google.com)
2. Update the `<link>` tag in `index.html`
3. Update CSS variables in `css/styles.css`:

```css
:root {
    --font-ar: 'YourArabicFont', sans-serif;
    --font-en: 'YourLatinFont', sans-serif;
}
```

### Logo
**File:** `index.html` (line 11)

Change the favicon emoji/symbol:
```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>YOUR_EMOJI</text></svg>">
```

Or use a real logo file:
```html
<link rel="icon" type="image/png" href="assets/icons/logo.png">
```

---

## 📦 Products

### Product Data
**File:** `js/products.js`

```javascript
export const products = [
    {
        id: "unique-id",              // Unique identifier
        name: "اسم المنتج",           // Product name
        description: "وصف المنتج",    // Brief description
        price: "يبدأ من XXX جنيه",   // Display price
        features: [                   // Array of features
            "ميزة 1",
            "ميزة 2",
            "ميزة 3"
        ],
        options: [                    // Customization options
            {
                id: "option-id",
                label: "اسم الخيار",
                choices: ["خيار 1", "خيار 2"]
            }
        ],
        visualType: "physical"        // Visual identifier
    }
];
```

### Add New Product
1. Copy existing product object
2. Change `id` to unique value
3. Update all fields
4. Add to products array
5. Product appears automatically in UI!

### Remove Product
Simply delete or comment out the product object in the array.

### Reorder Products
Products appear in the order they're listed in the array.

---

## 📝 Content

### Hero Section
**File:** `index.html` (lines 62-72)

```html
<h1 class="hero-title">K2rty</h1>
<p class="hero-subtitle">
    اجعل شيء مادي<br>متصل وذكي
</p>
```

Change the headline and tagline to match your brand.

### Section Titles
Search for `.section-title` in `index.html` and update:
- "اختار K2rty المناسب ليك" (Products)
- "كيف تعمل؟" (How It Works)
- "ليه K2rty؟" (Why K2rty)
- "أسئلة شائعة" (FAQ)

### FAQ Questions
**File:** `index.html` (lines 175-220)

Add/edit/remove FAQ items:
```html
<div class="faq-item">
    <button class="faq-question">
        <span>سؤالك هنا؟</span>
        <span class="faq-icon">+</span>
    </button>
    <div class="faq-answer">
        <p>الإجابة هنا.</p>
    </div>
</div>
```

### Footer
**File:** `index.html` (lines 225-260)

Update:
- Company tagline
- Social media links
- Contact information
- Copyright year

---

## 🔄 Order Flow

### Order Steps
**File:** `js/orderBuilder.js`

Current flow:
1. Product Selection → `renderStep1()`
2. Quantities → `renderStep2()`
3. Customization → `renderStep3()`
4. Customer Info → `renderStep4()`
5. Review & Submit → `renderStep5()`

To modify a step:
1. Find the corresponding `renderStepX()` function
2. Update the HTML/text
3. Keep the onclick handlers intact

### Required Fields
**File:** `js/orderService.js` (function: `validateOrder`)

```javascript
if (!order.customer.name || order.customer.name.trim().length < 2) {
    errors.push("الاسم مطلوب");
}
```

Adjust validation rules as needed.

### Success Message
**File:** `js/ui.js` (function: `createSuccessMessage`)

Customize the order confirmation message.

---

## 🔌 API Integration

### Connect Your Backend
**File:** `js/orderService.js` (function: `submitOrder`)

Replace the temporary localStorage implementation:

```javascript
export async function submitOrder(order) {
    try {
        const response = await fetch('https://api.yoursite.com/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY' // if needed
            },
            body: JSON.stringify(order)
        });
        
        if (!response.ok) {
            throw new Error('API error');
        }
        
        const data = await response.json();
        
        return {
            success: true,
            orderId: data.orderId,
            message: data.message
        };
        
    } catch (error) {
        console.error('Submission error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

### Order Object Structure
Your API will receive:
```javascript
{
    id: "K2-timestamp-random",
    customer: {
        name: string,
        phone: string,
        city: string
    },
    items: [
        {
            productId: string,
            productName: string,
            quantity: number,
            options: object
        }
    ],
    notes: string,
    status: "pending",
    createdAt: ISO timestamp
}
```

---

## 🌐 Navigation

### Menu Items
**File:** `index.html` (lines 43-47)

Add/remove navigation links:
```html
<a href="#section-id" class="nav-link">عنوان القسم</a>
```

Make sure corresponding section has the matching ID.

### CTA Buttons
**File:** `index.html`

Main CTAs:
- Line 50: `<button class="btn-primary" id="navCta">`
- Line 67: `<button class="btn-primary btn-lg" id="heroCta">`

Update text and behavior in `js/app.js` initialization.

---

## 📱 Mobile Behavior

### Breakpoints
**File:** `css/styles.css`

Current breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

Responsive utilities in Tailwind:
- `md:` = 768px+
- `lg:` = 1024px+

### Mobile Menu
Automatically shows hamburger menu below 768px.
Customize in `css/styles.css` (Mobile Navigation section).

---

## ⚡ Performance

### Optimize for Production

1. **Replace Tailwind CDN:**
```bash
npx tailwindcss -o css/tailwind.min.css --minify
```

2. **Update index.html:**
```html
<link rel="stylesheet" href="css/tailwind.min.css">
```

3. **Minify JavaScript:**
Use a tool like [Terser](https://terser.org/) to minify JS files.

4. **Optimize Images:**
Use WebP format and tools like Squoosh or TinyPNG.

### Lazy Loading
Images already use CSS, so no lazy loading needed.
For future real images, add:
```html
<img src="..." loading="lazy" alt="...">
```

---

## 🎯 SEO

### Meta Tags
**File:** `index.html` (lines 5-9)

Update:
```html
<title>Your Title</title>
<meta name="description" content="Your description">
<meta property="og:title" content="Your Title">
<meta property="og:description" content="Your description">
```

### Headings
Ensure proper hierarchy:
- H1: Used once (hero title)
- H2: Section titles
- H3: Subsection titles

---

## 🔒 Security

### Input Validation
Already implemented in `js/orderService.js`.

For production:
1. Add server-side validation
2. Sanitize all user input
3. Use HTTPS
4. Implement rate limiting on API
5. Add CSRF protection

---

## 🧪 Testing

### Manual Testing Checklist

**Functionality:**
- [ ] All navigation links work
- [ ] Product tabs switch correctly
- [ ] Order builder flows work
- [ ] Form validation works
- [ ] Modals open/close properly
- [ ] FAQ accordion works

**Responsive:**
- [ ] Test on 375px (mobile)
- [ ] Test on 768px (tablet)
- [ ] Test on 1280px (desktop)
- [ ] No horizontal scroll
- [ ] Touch targets are adequate (48px min)

**Cross-browser:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🚀 Deployment

### Quick Deploy Checklist

1. Update product data
2. Connect Dashboard API
3. Test order submission
4. Update brand colors (optional)
5. Update meta tags for SEO
6. Test on real mobile device
7. Optimize for production
8. Deploy to hosting
9. Configure domain
10. Enable SSL/HTTPS

### Hosting Options

**Static Hosting (Recommended):**
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

**Traditional Hosting:**
- Any web hosting with static file support
- No special server requirements

### Deploy Steps (Netlify Example)

1. Push code to GitHub
2. Connect Netlify to repository
3. Build settings: None needed (static site)
4. Publish directory: `/` (root)
5. Deploy!

---

## 📊 Analytics (Optional)

### Add Google Analytics
**File:** `index.html` (before `</head>`)

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your actual ID.

---

## 🆘 Common Issues

### Products not updating?
- Check `js/products.js` syntax
- Clear browser cache
- Check console for errors

### Styles broken?
- Verify Tailwind CDN loads
- Check `css/styles.css` syntax
- Clear cache and hard refresh

### Order not submitting?
- Check `orderService.js` implementation
- Verify API endpoint is correct
- Check network tab in DevTools

### Mobile menu not working?
- Check `js/app.js` navigation code
- Verify event listeners attached
- Test in different browser

---

## 💡 Pro Tips

1. **Version Control:** Use Git to track changes
2. **Staging Site:** Test on staging before production
3. **Backup:** Keep backups before major changes
4. **Documentation:** Update this file when you make changes
5. **Performance:** Monitor page load speed
6. **User Testing:** Get real feedback before launch

---

## 📞 Support

**Need help?**
- Check README.md for detailed docs
- Check QUICKSTART.md for quick tasks
- Review code comments in JS files
- Use browser DevTools console

---

**Configuration complete? Ready to launch K2rty!** 🚀
