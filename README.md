# K2rty — Premium Product Landing Page

K2rty is a modern, interactive product experience for physical-to-digital products. This is not a traditional landing page — it's a complete product showcase with a creative order flow.

## ✨ Key Features

- **Dynamic Pricing System** — Prices change based on customer selections
- **Multiple Product Images** — Different images for each product variant
- **Interactive Product Showcase** — Real-time price updates
- **Creative 5-Step Order Flow** — Product configurator experience
- **Mobile-First Responsive Design** — Premium UX on all devices
- **Zero Framework Dependencies** — Pure HTML + Tailwind + Vanilla JS

## Overview

K2rty features:
- Premium, minimal design system
- Interactive product showcase with smooth transitions
- Creative multi-step order builder
- Fully responsive (mobile-first)
- Pure HTML + Tailwind CSS + Vanilla JavaScript
- No framework dependencies
- Ready for Dashboard API integration

## Project Structure

```
K2rty/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Custom styles & design system
├── js/
│   ├── app.js              # Main application entry point
│   ├── products.js         # Product data configuration
│   ├── orderBuilder.js     # Creative order flow
│   ├── orderService.js     # Order service abstraction (API-ready)
│   └── ui.js               # UI helper functions
└── README.md               # This file
```

## How to Run

1. Clone or download this project
2. Open `index.html` in a modern web browser
3. That's it! No build process needed.

**For development server (optional):**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## Features

### 1. Interactive Product Showcase
- Three products: ميداليا (Physical), بطاقة (Card), استاند (Stand)
- Smooth tab-based selection
- Animated visual transitions
- Real-time content updates

### 2. Creative Order Builder
The order flow is designed as an experience, not a form:

**Step 1:** Product Selection  
Choose one or multiple products with visual feedback

**Step 2:** Quantity Selection  
Beautiful quantity controls for each product

**Step 3:** Customization  
Select options and customizations (if available)

**Step 4:** Customer Information  
Name, phone (WhatsApp), city, and optional notes

**Step 5:** Review & Submit  
Order summary with all details

### 3. Premium UI/UX
- Minimal, modern design
- Smooth animations and transitions
- Mobile-first responsive design
- Accessible keyboard navigation
- Reduced motion support

## Product Data Configuration

Products are configured in `js/products.js`:

```javascript
export const products = [
    {
        id: "physical",
        name: "ميداليا",
        description: "...",
        price: "يبدأ من 299 جنيه",
        features: [...],
        options: [...],
        visualType: "physical"
    },
    // ...
];
```

### How to Add/Edit Products

1. Open `js/products.js`
2. Add/modify product objects in the `products` array
3. Each product requires:
   - `id`: Unique identifier
   - `name`: Product name
   - `description`: Brief description
   - `price`: Display price
   - `features`: Array of feature strings
   - `options`: Array of customization options (optional)
   - `visualType`: Visual identifier for rendering

No code changes needed elsewhere — the UI updates automatically!

## Dashboard API Integration

The order submission layer is ready for backend integration.

### Current Implementation (Temporary)
Orders are saved to `localStorage` for development/testing.

### How to Connect to Your Dashboard API

1. Open `js/orderService.js`
2. Find the `submitOrder` function
3. Replace the temporary implementation with your API call:

```javascript
export async function submitOrder(order) {
    try {
        const response = await fetch('https://your-api.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers if needed
            },
            body: JSON.stringify(order)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit order');
        }
        
        const data = await response.json();
        
        return {
            success: true,
            orderId: data.orderId,
            message: data.message
        };
        
    } catch (error) {
        console.error('Order submission error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

### Order Object Structure

```javascript
{
    id: "K2-1234567890-123",
    customer: {
        name: "أحمد محمد",
        phone: "01012345678",
        city: "القاهرة"
    },
    items: [
        {
            productId: "card",
            productName: "بطاقة",
            quantity: 2,
            options: {
                material: "معدن",
                engraving: "اسم مخصص"
            }
        }
    ],
    notes: "أي ملاحظات إضافية",
    status: "pending",
    createdAt: "2026-10-05T12:00:00.000Z"
}
```

## Design System

### Colors
```css
--bg: #FAFAF9           /* Background */
--surface: #FFFFFF      /* Card surfaces */
--text: #1A1A1A         /* Primary text */
--text-muted: #737373   /* Secondary text */
--border: #E5E5E5       /* Borders */
--accent: #0F172A       /* Primary accent */
--accent-hover: #334155 /* Accent hover state */
--accent-soft: #F1F5F9  /* Soft accent background */
```

### Typography
- Arabic: Tajawal (Google Fonts)
- English: Inter (Google Fonts)

### Spacing Scale
- XS: 0.5rem (8px)
- SM: 1rem (16px)
- MD: 1.5rem (24px)
- LG: 2rem (32px)
- XL: 3rem (48px)
- 2XL: 4rem (64px)
- 3XL: 6rem (96px)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Performance

- No external dependencies except Tailwind CDN and Google Fonts
- Minimal JavaScript (~15KB total)
- Fast page load
- Smooth 60fps animations
- Optimized for mobile

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Reduced motion support
- Sufficient color contrast

## Customization Guide

### Change Brand Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --accent: #YourColor;
}
```

### Change Typography
1. Update Google Fonts link in `index.html`
2. Update CSS variables in `css/styles.css`:
```css
:root {
    --font-ar: 'YourFont', sans-serif;
}
```

### Modify Order Flow
Edit step functions in `js/orderBuilder.js`:
- `renderStep1()` - Product selection
- `renderStep2()` - Quantities
- `renderStep3()` - Options
- `renderStep4()` - Customer info
- `renderStep5()` - Summary

### Add More Steps
1. Increment total steps in navigation logic
2. Add new `renderStepX()` function
3. Update step switch in `renderStep()`

## WhatsApp Integration (Future)

The project is designed for WhatsApp-first communication. When backend is ready:

1. Capture order in the frontend (already implemented)
2. Send order to your Dashboard API (see integration guide above)
3. Your backend can then:
   - Send confirmation to customer via WhatsApp API
   - Notify admin
   - Track order status

## Testing

### Manual Testing Checklist

**Desktop:**
- [ ] Navigation works smoothly
- [ ] Product tabs switch correctly
- [ ] Order builder flows through all steps
- [ ] All buttons respond properly
- [ ] Modals open and close correctly
- [ ] FAQ accordion works

**Mobile:**
- [ ] Layout is responsive
- [ ] Mobile menu works
- [ ] Product selector fits screen
- [ ] Order builder is usable
- [ ] Touch interactions work
- [ ] No horizontal scroll

**Order Flow:**
- [ ] Can select products
- [ ] Can adjust quantities
- [ ] Can customize options
- [ ] Can enter customer info
- [ ] Order summary displays correctly
- [ ] Success message appears after submit

## Production Deployment

Before going live:

1. Replace Tailwind CDN with production build:
```bash
npx tailwindcss -o css/tailwind.min.css --minify
```

2. Update `index.html` to use local Tailwind file

3. Add your actual Dashboard API endpoint in `orderService.js`

4. Test order submission with real API

5. Add analytics (Google Analytics, etc.) if needed

6. Set up proper domain and SSL certificate

7. Test on real mobile devices

## Future Enhancements

- [ ] Product image uploads
- [ ] Real-time order tracking
- [ ] Payment integration
- [ ] Email confirmations
- [ ] Admin dashboard connection
- [ ] Analytics dashboard
- [ ] A/B testing variants
- [ ] Multi-language support (full English version)

## Support

For questions or issues:
- Review this README
- Check code comments in JS files
- Test in browser console for errors

## License

© 2026 K2rty. All rights reserved.

---

**Built with care for a premium product experience.**
