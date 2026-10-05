# K2rty Quick Start Guide

## 🚀 Get Started in 30 Seconds

1. **Open the project**
   - Simply open `index.html` in your browser
   - No installation or build process required!

2. **Test the experience**
   - Click "استكشف المنتجات" on the homepage
   - Switch between product tabs (ميداليا, بطاقة, استاند)
   - Click "اطلب الآن" to try the order builder
   - Go through all 5 steps of the order flow

3. **That's it!** ✨

---

## 📝 Common Tasks

### Change Product Data
**File:** `js/products.js`

```javascript
// Edit the products array
export const products = [
    {
        id: "physical",
        name: "ميداليا",
        description: "Your new description...",
        price: "يبدأ من 299 جنيه",
        // ... rest of the product
    }
];
```

### Change Brand Colors
**File:** `css/styles.css`

```css
:root {
    --accent: #YourNewColor;
    --accent-hover: #YourHoverColor;
}
```

### Connect to Your API
**File:** `js/orderService.js`

Find the `submitOrder` function and replace with:
```javascript
export async function submitOrder(order) {
    const response = await fetch('YOUR_API_URL/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });
    return await response.json();
}
```

---

## 🎨 Design Philosophy

**Simple ≠ Boring**

- Premium, not flashy
- Minimal, not empty  
- Modern, not trendy
- Fast, not rushed
- Clear, not obvious

---

## 🏗️ Project Architecture

```
User clicks "اطلب الآن"
    ↓
Order Builder opens (orderBuilder.js)
    ↓
User goes through 5 steps
    ↓
Order object created (orderService.js)
    ↓
Order validated
    ↓
Order submitted (localStorage OR your API)
    ↓
Success message shown
```

---

## ✅ Pre-Launch Checklist

- [ ] Update product data in `js/products.js`
- [ ] Test on mobile device
- [ ] Connect Dashboard API in `js/orderService.js`
- [ ] Test order submission
- [ ] Update brand colors (optional)
- [ ] Add Google Analytics (optional)
- [ ] Test FAQ accordion
- [ ] Test all navigation links
- [ ] Check responsive design at different sizes
- [ ] Test order flow end-to-end

---

## 🐛 Troubleshooting

**Order not submitting?**
- Check browser console for errors
- Verify `orderService.js` is properly loaded
- Check that API endpoint is correct (if connected)

**Products not showing?**
- Check `js/products.js` syntax
- Ensure product IDs are unique
- Check browser console for errors

**Styling looks wrong?**
- Clear browser cache
- Check `css/styles.css` is loaded
- Verify Tailwind CDN is accessible

**Mobile menu not working?**
- Check `js/app.js` navigation code
- Verify event listeners are attached
- Check browser console for errors

---

## 📱 Test on Mobile

1. Open Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Test these sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1280px+)

---

## 🎯 Key Features to Demo

1. **Interactive Product Showcase**
   - Tab switching with smooth transitions
   - Real-time content updates

2. **Creative Order Builder**
   - 5-step flow that feels like a product, not a form
   - Beautiful quantity controls
   - Smart validation

3. **Premium UX**
   - Smooth animations
   - Responsive design
   - Accessible navigation

---

## 💡 Tips

- **Development:** Use a local server for best experience
- **Production:** Replace Tailwind CDN with production build
- **Performance:** Images are CSS-based for fast loading
- **Customization:** All colors/spacing use CSS variables
- **Scaling:** Product data is separate from UI code

---

## 🚢 Ready to Deploy?

1. Test everything locally
2. Connect your Dashboard API
3. Test order submission
4. Deploy to your hosting
5. Point your domain
6. Launch! 🎉

---

**Need more details?** Check `README.md` for the full documentation.

**Happy building with K2rty!** ✨
