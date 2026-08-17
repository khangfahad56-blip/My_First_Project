<?php
// includes/header.php – Shared navigation header (Phase 2 Updated)
$current_page = basename($_SERVER['PHP_SELF'], '.php');
$base_url     = '/fahad_jewellery';
?>
<!DOCTYPE html>
<html lang="ur-PK" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($page_title ?? 'Fahad Jewellery – Pure Gold & Italian Silver in Nowshera') ?></title>
  <meta name="description" content="<?= htmlspecialchars($page_description ?? 'Fahad Jewellery – Trusted Gold & Silver Jewellery in Nowshera since 2010. Owned by Gul Nawaz Khan. 24K & 21K Gold, Italian Silver, Gold Buying & Repair.') ?>">
  <meta name="keywords"    content="Fahad Jewellery, Gold Jewellery Nowshera, 24K Gold, 21K Gold, Italian Silver Pakistan, Gold Buying Nowshera, Jewellery Repair, Gul Nawaz Khan">
  <meta name="author"      content="Fahad Jewellery – Gul Nawaz Khan">
  <meta property="og:title"       content="<?= htmlspecialchars($page_title ?? 'Fahad Jewellery') ?>">
  <meta property="og:description" content="Trusted 24K & 21K Gold and Italian Silver Jewellery in Nowshera since 2010.">
  <meta property="og:image"       content="<?= $base_url ?>/assets/images/hero.png">
  <meta property="og:type"        content="website">
  <link rel="icon" type="image/x-icon" href="<?= $base_url ?>/assets/images/favicon.ico">

  <!-- Tailwind CSS v3 CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'navy-deep':     '#0C1636',
            'navy-royal':    '#151542',
            'gold-accent':   '#C5A059',
            'gold-light':    '#E6CA85',
            'pearl-white':   '#FFFFFF',
            'ivory-surface': '#FAF9F6',
            'onyx':          '#1A1A1A',
            'muted-gray':    '#595959',
            'border-silver': '#E5E5E5',
          },
          fontFamily: {
            'serif-luxury':  ['Lora', 'Georgia', 'serif'],
            'heading':       ['Outfit', 'sans-serif'],
            'body':          ['Nunito Sans', 'sans-serif'],
            'script':        ['Pinyon Script', 'cursive'],
          },
          boxShadow: {
            'luxury-sm': '0 2px 8px rgba(12,22,54,0.06)',
            'luxury-md': '0 6px 20px rgba(12,22,54,0.10)',
            'luxury-lg': '0 12px 36px rgba(12,22,54,0.15)',
            'gold-glow': '0 0 20px rgba(197,160,89,0.30)',
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700&family=Outfit:wght@300;400;500;600;700&family=Pinyon+Script&display=swap" rel="stylesheet">

  <!-- Custom CSS -->
  <link rel="stylesheet" href="<?= $base_url ?>/assets/css/style.css">
</head>
<body class="bg-pearl-white text-onyx font-body antialiased">

<!-- TOP ANNOUNCEMENT BAR -->
<div class="bg-navy-deep text-pearl-white text-xs py-2 px-4 tracking-wider">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center sm:text-left">
    <div class="flex items-center gap-4">
      <span class="text-gold-accent font-semibold flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        Guaranteed 24K & 21K Pure Gold
      </span>
      <span class="hidden sm:inline opacity-40">|</span>
      <span class="hidden sm:inline">Sat – Thu: 10 AM – 7 PM (Friday Closed)</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="tel:03339013157" class="hover:text-gold-accent transition-colors flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        0333-9013157
      </a>
      <span class="opacity-40">|</span>
      <span class="text-gold-light">PKR (Rs.)</span>
    </div>
  </div>
</div>

<!-- STICKY NAVIGATION HEADER -->
<header id="main-header" class="sticky top-0 z-40 bg-pearl-white border-b border-border-silver transition-all duration-300 shadow-luxury-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">

      <!-- Mobile Menu Toggle -->
      <button id="mobile-menu-btn" class="lg:hidden text-navy-deep p-2" aria-label="Open menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <!-- Logo -->
      <a href="<?= $base_url ?>/index.php" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-full bg-navy-deep flex items-center justify-center text-gold-accent font-serif-luxury font-bold text-lg group-hover:bg-gold-accent group-hover:text-navy-deep transition-all duration-300">F</div>
        <div class="flex flex-col leading-tight">
          <span class="font-serif-luxury text-xl font-bold tracking-widest text-navy-deep group-hover:text-gold-accent transition-colors">FAHAD</span>
          <span class="text-[9px] tracking-[0.25em] font-heading font-semibold text-gold-accent uppercase">Gold & Silver Jewellery</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-7 font-heading text-sm font-medium tracking-wide uppercase text-navy-deep">
        <a href="<?= $base_url ?>/index.php"          class="hover:text-gold-accent transition-colors py-1 border-b-2 border-transparent hover:border-gold-accent <?= $current_page==='index'?'nav-link-active':'' ?>">Home</a>
        <a href="<?= $base_url ?>/collections.php"    class="hover:text-gold-accent transition-colors py-1 border-b-2 border-transparent hover:border-gold-accent <?= $current_page==='collections'?'nav-link-active':'' ?>">Collections</a>
        <a href="<?= $base_url ?>/services.php"       class="hover:text-gold-accent transition-colors py-1 border-b-2 border-transparent hover:border-gold-accent <?= $current_page==='services'?'nav-link-active':'' ?>">Services</a>
        <a href="<?= $base_url ?>/gold-rates.php"     class="hover:text-gold-accent transition-colors py-1 border-b-2 border-transparent hover:border-gold-accent <?= $current_page==='gold-rates'?'nav-link-active':'' ?>">Gold Rates</a>
        <a href="<?= $base_url ?>/about.php"          class="hover:text-gold-accent transition-colors py-1 border-b-2 border-transparent hover:border-gold-accent <?= $current_page==='about'?'nav-link-active':'' ?>">About Us</a>
        <a href="<?= $base_url ?>/contact.php"        class="hover:text-gold-accent transition-colors py-1 border-b-2 border-transparent hover:border-gold-accent <?= $current_page==='contact'?'nav-link-active':'' ?>">Contact</a>
      </nav>

      <!-- WhatsApp CTA Button -->
      <a href="https://wa.me/923339013157?text=Assalam%20o%20Alaikum!%20I%20am%20interested%20in%20Fahad%20Jewellery%20services." target="_blank" class="hidden sm:flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-full text-xs font-heading font-bold tracking-wide transition-all duration-300 shadow-luxury-sm hover:shadow-luxury-md">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        WhatsApp
      </a>

    </div>
  </div>

  <!-- Mobile Menu Drawer -->
  <div id="mobile-menu" class="hidden lg:hidden bg-pearl-white border-t border-border-silver px-4 pt-4 pb-5 space-y-2 font-heading uppercase tracking-wider text-sm text-navy-deep">
    <a href="<?= $base_url ?>/index.php"       class="block py-2 border-b border-border-silver hover:text-gold-accent">Home</a>
    <a href="<?= $base_url ?>/collections.php" class="block py-2 border-b border-border-silver hover:text-gold-accent">Collections</a>
    <a href="<?= $base_url ?>/services.php"    class="block py-2 border-b border-border-silver hover:text-gold-accent">Services</a>
    <a href="<?= $base_url ?>/gold-rates.php"  class="block py-2 border-b border-border-silver hover:text-gold-accent">Gold Rates</a>
    <a href="<?= $base_url ?>/about.php"       class="block py-2 border-b border-border-silver hover:text-gold-accent">About Us</a>
    <a href="<?= $base_url ?>/contact.php"     class="block py-2 hover:text-gold-accent">Contact</a>
  </div>
</header>
