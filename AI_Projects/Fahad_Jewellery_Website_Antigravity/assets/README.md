# 🎨 Assets Directory

Static resources including stylesheets, scripts, images, and fonts for the Fahad Jewellery platform.

## 📁 Structure

```
assets/
├── 📁 css/              # Stylesheets
├── 📁 js/               # JavaScript files
├── 📁 images/           # Images & graphics
│   ├── products/        # Product photos
│   ├── logos/          # Company logos
│   ├── icons/          # UI icons
│   └── banners/        # Hero images & banners
├── 📁 fonts/           # Custom web fonts
└── 📁 vendor/          # Third-party libraries
```

---

## 🎨 CSS Stylesheets

### Location: `assets/css/`

**Main Files:**
- `style.css` – Global styles
- `layout.css` – Layout & grid
- `components.css` – Reusable components
- `responsive.css` – Media queries
- `animations.css` – Transitions & animations

**Color Palette:**
```css
--color-navy-deep: #0C1636;      /* Primary dark */
--color-navy-royal: #151542;     /* Secondary dark */
--color-gold-accent: #C5A059;    /* Accent gold */
--color-pearl-white: #FFFBF7;    /* Off-white */
--color-text: #111636;           /* Text primary */
--color-text-muted: #6B7280;     /* Text secondary */
```

**Typography:**
```css
--font-body: 'Gantari', sans-serif;      /* Body font */
--font-heading: 'Outfit', serif;         /* Heading font */
--font-mono: 'Courier New', monospace;   /* Code font */
```

**Usage:**
```html
<link rel="stylesheet" href="/fahad_jewellery/assets/css/style.css">
```

---

## 📜 JavaScript Files

### Location: `assets/js/`

**Main Files:**
- `main.js` – Main application logic
- `utils.js` – Utility functions
- `api.js` – API interactions
- `animations.js` – Dynamic animations
- `form-validation.js` – Form handling

**Common Functions:**
```javascript
// Form validation
validateEmail(email)
validatePhone(phone)
submitForm(formId)

// API calls
fetchGoldRates()
submitEnquiry(data)

// UI interactions
toggleMenu()
smoothScroll()
lazyLoadImages()
```

**Usage:**
```html
<script src="/fahad_jewellery/assets/js/main.js"></script>
```

---

## 🖼️ Images

### Location: `assets/images/`

#### Product Images (`products/`)
- High-resolution product photos
- Multiple angles per product
- Naming: `product-{id}-{angle}.jpg`
- Format: JPG, PNG (max 500KB)
- Resolution: 1200x1200px minimum

#### Logos (`logos/`)
- `fahad-jewellery-logo.svg` – Main logo
- `fahad-jewellery-logo-dark.svg` – Dark variant
- `fahad-jewellery-favicon.ico` – Favicon
- `fahad-jewellery-og-image.jpg` – Social sharing

#### Icons (`icons/`)
- `menu.svg` – Navigation icons
- `search.svg` – Search icon
- `cart.svg` – Shopping cart
- `heart.svg` – Wishlist/favorites
- Navigation & social icons

#### Banners (`banners/`)
- `hero-home.jpg` – Homepage hero image
- `hero-collections.jpg` – Collections page
- `seasonal-banner.jpg` – Promotional banners
- Resolution: 1920x600px (full-width)

### Image Optimization

**Best Practices:**
- ✅ Compress images before upload (Tinypng.com)
- ✅ Use WebP format where supported
- ✅ Provide fallback PNG/JPG
- ✅ Use lazy loading for below-fold images
- ✅ Responsive images with srcset

**Example:**
```html
<img src="/fahad_jewellery/assets/images/products/product-1.jpg"
     srcset="/fahad_jewellery/assets/images/products/product-1-sm.jpg 640w,
             /fahad_jewellery/assets/images/products/product-1.jpg 1024w"
     alt="Gold Bracelet">
```

---

## 🔤 Fonts

### Location: `assets/fonts/`

**Web Fonts:**
- `Outfit-Regular.woff2` – Heading font (regular)
- `Outfit-Bold.woff2` – Heading font (bold)
- `Outfit-Light.woff2` – Heading font (light)
- `Gantari-Regular.woff2` – Body font (regular)
- `Gantari-Medium.woff2` – Body font (medium)

**Font Import:**
```css
@font-face {
    font-family: 'Outfit';
    src: url('/fahad_jewellery/assets/fonts/Outfit-Regular.woff2') format('woff2');
    font-weight: 400;
}

@font-face {
    font-family: 'Gantari';
    src: url('/fahad_jewellery/assets/fonts/Gantari-Regular.woff2') format('woff2');
    font-weight: 400;
}
```

**Font Loading:**
- 🚀 Uses WOFF2 format (modern browsers)
- ⚡ Preload critical fonts for faster rendering
- 🔄 System fallback fonts while loading

---

## 📦 Vendor Libraries

### Location: `assets/vendor/`

**Included Libraries:**
- `bootstrap/` – Bootstrap CSS framework
- `fontawesome/` – Icon library
- `jquery/` – JavaScript library (if used)
- `slick/` – Carousel library
- `AOS/` – Scroll animations

**Usage:**
```html
<link rel="stylesheet" href="/fahad_jewellery/assets/vendor/bootstrap/css/bootstrap.min.css">
<script src="/fahad_jewellery/assets/vendor/jquery/jquery.min.js"></script>
```

---

## 📁 File Organization Best Practices

### Naming Conventions

**CSS Files:**
```
style.css              (global)
components.css        (reusable)
layout.css            (page layout)
responsive.css        (media queries)
animations.css        (transitions)
```

**JavaScript Files:**
```
main.js               (entry point)
utils.js              (utilities)
api.js                (API calls)
form-validation.js    (forms)
animations.js         (DOM effects)
```

**Images:**
```
products/product-{id}-{angle}.jpg
logos/fahad-jewellery-{variant}.svg
icons/icon-{name}.svg
banners/banner-{page}-{version}.jpg
```

### Directory Limits
- ✅ Max 50 images per folder
- ✅ Total assets < 100MB
- ✅ Organize by component/page

---

## 🚀 Performance Optimization

### Image Optimization
```bash
# Compress JPEG
jpegoptim --max=85 --strip-all image.jpg

# Compress PNG
pngquant --quality=80 image.png

# Convert to WebP
cwebp image.jpg -o image.webp
```

### CSS Optimization
- ✅ Minified: `style.min.css`
- ✅ Combined: Single file for critical CSS
- ✅ Media queries: Mobile-first approach
- ✅ Unused CSS: Remove with PurgeCSS

### JavaScript Optimization
- ✅ Minified: `main.min.js`
- ✅ Deferred: `defer` attribute on script tags
- ✅ Lazy loaded: Load non-critical scripts later
- ✅ Bundled: Use webpack/Vite for bundling

### Load Time Targets
- 🎯 CSS: < 50KB
- 🎯 JS: < 100KB
- 🎯 Images: < 2MB total
- 🎯 Page load: < 3 seconds

---

## 🔗 Resource Links

### In HTML
```html
<!-- CSS -->
<link rel="stylesheet" href="/fahad_jewellery/assets/css/style.css">

<!-- JavaScript -->
<script src="/fahad_jewellery/assets/js/main.js"></script>

<!-- Images -->
<img src="/fahad_jewellery/assets/images/products/necklace-1.jpg" alt="Gold Necklace">

<!-- Fonts -->
<link rel="preload" as="font" href="/fahad_jewellery/assets/fonts/Outfit-Bold.woff2" type="font/woff2" crossorigin>
```

---

## 🧪 Testing Assets

### Check Loading
```bash
# Verify CSS loads
curl -I http://localhost/fahad_jewellery/assets/css/style.css

# Verify images exist
ls -lh /fahad_jewellery/assets/images/
```

### Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check file sizes and load times
5. Verify images/fonts loaded correctly

---

## 🐛 Troubleshooting

### Images Not Loading
**Problem:** Broken image icons
**Solution:**
- Check file path is correct
- Verify file exists in folder
- Check file permissions (644 or 644)
- Verify image format is supported

### Fonts Not Loading
**Problem:** Using fallback fonts
**Solution:**
- Check @font-face URLs are correct
- Verify font files exist
- Check CORS headers if CDN
- Test in different browsers

### Styles Not Applied
**Problem:** CSS not showing
**Solution:**
- Hard refresh browser (Ctrl+Shift+R)
- Check CSS file path
- Verify CSS syntax in browser DevTools
- Check CSS specificity/cascading rules

### Slow Loading
**Problem:** Page takes long to load
**Solution:**
- Compress/optimize images
- Minify CSS & JavaScript
- Enable browser caching
- Use CDN for large files
- Lazy load below-fold images

---

## 📊 Asset Statistics

**Typical Project Sizes:**
- CSS Files: 10-50 KB
- JavaScript: 30-100 KB
- Images: 500KB-2MB
- Fonts: 100-500 KB
- **Total: < 5 MB**

---

## 📝 Version Control

### Git Ignore Large Files
```bash
# .gitignore
assets/images/products/*.jpg
assets/images/banners/*.jpg
assets/vendor/

# Track only sources
!assets/source/
```

Use git-lfs for large binaries:
```bash
git lfs track "assets/**/*.jpg"
git lfs track "assets/**/*.mp4"
```

---

**Last Updated:** 2026-08-16  
**Version:** 2.0
