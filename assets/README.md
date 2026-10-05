# Assets Directory

## Structure

```
assets/
├── images/          # Product images, hero visuals
└── icons/           # Icon files (SVG recommended)
```

## Usage

### Product Images
Place product images here and reference them in `js/products.js`:

```javascript
{
    id: "physical",
    name: "ميداليا",
    image: "assets/images/physical-product.jpg",
    // ...
}
```

### Icons
- Use SVG format for best quality and performance
- Keep file sizes small (<10KB per icon)
- Use consistent naming: `icon-name.svg`

## Recommendations

**Images:**
- Format: WebP or JPG
- Max size: 1200px width
- Optimize before upload (TinyPNG, Squoosh, etc.)
- Use descriptive filenames: `product-card-front.jpg`

**Icons:**
- Format: SVG
- Inline small icons in HTML/CSS
- External file for larger/complex icons
- Optimize SVG code (SVGOMG)

## Current Implementation

Currently, product visuals are CSS-based (no image files needed) for:
- Fast loading
- Easy customization
- No external dependencies

When you're ready to add real product images:
1. Add images to `assets/images/`
2. Update product data in `js/products.js`
3. Update visual rendering in `js/ui.js`

## Future Enhancements

- Product galleries
- Hero background images
- Customer testimonial photos
- Brand logos and badges
- Social media graphics
