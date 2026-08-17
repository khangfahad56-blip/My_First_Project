# 📋 Includes Directory

Reusable template components and PHP includes for consistent markup across the Fahad Jewellery platform.

## 📁 Structure

```
includes/
├── 📄 header.php          # Common header component
├── 📄 footer.php          # Common footer component
├── 📄 navigation.php      # Navigation menu
├── 📄 sidebar.php         # Sidebar menu
├── 📄 meta-tags.php       # SEO meta tags
├── 📄 analytics.php       # Tracking code
└── 📄 functions.php       # Utility functions
```

---

## 📄 Key Files

### `header.php`
Common header template included on all pages.

**Contains:**
- DOCTYPE & HTML tags
- Head section (meta, title, CSS links)
- Navigation bar
- Logo & branding
- Mobile menu toggle

**Usage:**
```php
<?php
$page_title = 'Page Title';
$page_description = 'Page description for meta tags';
include 'includes/header.php';
?>
```

**HTML Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $page_description; ?>">
    <link rel="stylesheet" href="/fahad_jewellery/assets/css/style.css">
</head>
<body>
    <header>
        <!-- Navigation, logo, etc. -->
    </header>
```

---

### `footer.php`
Common footer template included on all pages.

**Contains:**
- Footer navigation links
- Company info & contact
- Social media links
- Newsletter subscription
- Copyright notice
- Link to privacy policy & terms

**Usage:**
```php
<?php
include 'includes/footer.php';
?>
</body>
</html>
```

**HTML Structure:**
```html
    <footer class="bg-navy-deep text-pearl-white">
        <div class="footer-content">
            <!-- Footer sections -->
        </div>
        <div class="footer-bottom">
            <p>&copy; 2010-2026 Fahad Jewellery. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
```

---

### `navigation.php`
Navigation menu component for main site.

**Features:**
- ✅ Dynamic menu items
- ✅ Active page highlighting
- ✅ Dropdown menus (collections)
- ✅ Mobile responsive menu
- ✅ Search bar integration

**Usage:**
```php
<?php
$current_page = basename($_SERVER['PHP_SELF'], '.php');
include 'includes/navigation.php';
?>
```

**Menu Structure:**
```
Home
Collections
  ├─ 24K Gold
  ├─ 21K Gold
  └─ Silver
Services
Gold Rates
Contact
```

---

### `meta-tags.php`
SEO & Open Graph meta tags.

**Contains:**
- Meta charset & viewport
- Meta descriptions
- Open Graph tags (social sharing)
- Twitter Card tags
- Canonical URLs
- Schema.org structured data

**Usage:**
```php
<?php
$page_title = 'Fahad Jewellery';
$page_description = 'Premium 24K & 21K Gold Jewelry';
$og_image = '/fahad_jewellery/assets/images/og-image.jpg';
include 'includes/meta-tags.php';
?>
```

**Generated Tags:**
```html
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
```

---

### `sidebar.php`
Admin sidebar navigation (for admin pages).

**Features:**
- Dashboard links
- Product management
- Order management
- User management
- Settings
- Logout button

**Usage:**
```php
<?php
session_start();
include 'includes/sidebar.php';
?>
```

---

### `functions.php`
Utility functions used across the site.

**Common Functions:**
```php
// Format price in PKR
format_price($amount)  → "PKR 12,500.00"

// Get gold rate for date
get_gold_rate($date)   → ["24k" => 12500, ...]

// Check if user is admin
is_admin()             → true/false

// Sanitize output
sanitize($text)        → "Safe &lt;html&gt;"

// Redirect with message
redirect($url, $msg)   → Redirect & set session
```

**Usage:**
```php
<?php
require_once 'includes/functions.php';

echo format_price(12500);  // Output: PKR 12,500.00
?>
```

---

### `analytics.php`
Tracking & analytics code (GA, Ads, etc.).

**Contains:**
- Google Analytics tracking code
- Facebook Pixel
- Google Ads conversion code
- Custom event tracking

**Usage:**
```php
<?php
include 'includes/analytics.php';  // At end of body
?>
```

**Example:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXXXX-X');
</script>
```

---

## 📐 Page Template Pattern

### Typical Page Structure

```php
<?php
// 1. Start session if needed
session_start();

// 2. Include config
require_once 'config/db.php';
require_once 'includes/functions.php';

// 3. Page-specific logic
$page_title = 'Page Title';
$page_description = 'Meta description';

// 4. Load header
include 'includes/header.php';
?>

<!-- 5. Page content -->
<main class="main-content">
    <section>
        <!-- Your content here -->
    </section>
</main>

<!-- 6. Load footer -->
<?php include 'includes/footer.php'; ?>
```

---

## 🔄 Include Best Practices

### Use Absolute Paths
```php
// ✅ Good
require_once __DIR__ . '/../config/db.php';

// ❌ Bad
require_once '../config/db.php';
```

### Check File Exists
```php
if (file_exists('includes/header.php')) {
    include 'includes/header.php';
} else {
    die('Header template missing');
}
```

### Avoid Duplicate Includes
```php
require_once 'config/db.php';    // Loads once
require 'config/db.php';         // Could load multiple times
```

### Limit Include Depth
```
page.php
  ├─ header.php
  │   ├─ navigation.php
  │   ├─ meta-tags.php
  │   └─ functions.php
  ├─ [Page content]
  └─ footer.php
```

---

## 🛡️ Security in Includes

### Prevent Direct Access
Add to top of include files:
```php
<?php
// Prevent direct access to include file
if (!defined('FAHAD_JEWELLERY')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Access denied');
}
?>
```

Define constant in main files:
```php
<?php
define('FAHAD_JEWELLERY', true);
include 'includes/header.php';
?>
```

### Escape Output
```php
<?php
// ✅ Safe - outputs escaped HTML
echo htmlspecialchars($user_input);

// ❌ Dangerous - can cause XSS
echo $user_input;
?>
```

---

## 🎨 Customization

### Add New Include

1. Create file: `includes/new-component.php`
2. Add security check at top
3. Create modular, reusable code
4. Document usage with comments

**Template:**
```php
<?php
// includes/new-component.php
// Description: Component description
// Usage: include 'includes/new-component.php';

if (!defined('FAHAD_JEWELLERY')) exit('Access denied');

// Component code
?>
```

### Override Includes per Page

```php
<?php
// Use custom header for specific page
$custom_header = true;
include 'includes/header-custom.php';
// Instead of default header
?>
```

---

## 📊 Common Variables Passed to Includes

| Variable | Type | Used In | Purpose |
|----------|------|---------|---------|
| `$page_title` | string | header.php | Page title in browser tab |
| `$page_description` | string | meta-tags.php | SEO meta description |
| `$current_page` | string | navigation.php | Highlight active menu |
| `$user_data` | array | footer.php | User info if logged in |
| `$site_url` | string | footer.php | Site domain for links |

---

## 🧪 Testing Includes

### Verify Include Works

```php
<?php
require_once 'config/db.php';

if (ob_start()) {
    include 'includes/header.php';
    $header_content = ob_get_clean();
    
    if (strpos($header_content, '<header>') !== false) {
        echo "✅ Header included successfully";
    }
}
?>
```

### Check for Errors

```bash
# Lint PHP files for syntax errors
php -l includes/header.php
php -l includes/footer.php
```

---

## 📈 Performance Tips

### Cache Include Files
- Include files are parsed on each request
- Consider using PHP opcache
- Enable in php.ini: `opcache.enable=1`

### Minimize Includes
- Don't include files you don't need
- Combine related includes
- Use conditional includes

### Optimize File Size
- Remove unnecessary comments
- Minimize whitespace
- Compress CSS/JS in includes

---

## 🐛 Troubleshooting

### Include Not Found
```
Warning: include(../config/db.php): Failed to open stream
```
**Solution:** Use absolute path with `__DIR__`

### White Screen
**Solution:** 
- Check for PHP parse errors: `php -l file.php`
- Enable error reporting: `error_reporting(E_ALL);`
- Check error logs

### Duplicate Output
**Solution:**
- Check for duplicate includes
- Remove multiple `include` calls
- Use `require_once` or `include_once`

---

**Last Updated:** 2026-08-16  
**Version:** 2.0
