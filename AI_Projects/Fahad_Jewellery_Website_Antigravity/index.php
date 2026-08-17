<?php
// index.php – Fahad Jewellery Homepage (Phase 2 Updated)
require_once 'config/db.php';
require_once 'handlers/gold_rate_api.php';
$base_url = '/fahad_jewellery';

$rates = get_latest_gold_rates($conn);

// Fetch featured products (24K, 21K Gold and Silver)
$featured_products = [];
if ($conn) {
    $res = $conn->query("SELECT * FROM products WHERE is_featured=1 AND is_available=1 ORDER BY id LIMIT 6");
    if ($res) {
        while ($row = $res->fetch_assoc()) $featured_products[] = $row;
    }
}

// Fetch testimonials
$testimonials = [];
if ($conn) {
    $res = $conn->query("SELECT * FROM testimonials WHERE is_approved=1 ORDER BY id LIMIT 6");
    if ($res) {
        while ($row = $res->fetch_assoc()) $testimonials[] = $row;
    }
}

$page_title       = 'Fahad Jewellery – Pure 24K & 21K Gold & Silver Jewellery in Nowshera';
$page_description = 'Fahad Jewellery Nowshera – Certified 24K & 21K Pure Gold, Normal & Italian Silver, Gold Buying & Repair Services. Owned by Gul Nawaz Khan since 2010.';

include 'includes/header.php';
?>

<!-- ═══════════════════════════════════════════════════════════
     1. HERO SECTION
═══════════════════════════════════════════════════════════ -->
<section id="hero" class="relative bg-navy-deep text-pearl-white overflow-hidden py-16 lg:py-24">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(197,160,89,0.15)_0%,_transparent_60%)] pointer-events-none"></div>
  <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-gold-accent/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

      <!-- Left: Hero Copy -->
      <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-royal/80 border border-gold-accent/30 text-gold-accent text-xs font-heading font-semibold uppercase tracking-widest">
          <span class="w-2 h-2 rounded-full bg-gold-accent animate-ping"></span>
          Established 2010 — Nowshera, KPK
        </div>

        <h1 class="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-pearl-white">
          Pure 24K &amp; 21K Gold <br>
          <span class="italic font-normal text-gold-accent">&amp; Silver Jewellery</span>
        </h1>

        <p class="text-base sm:text-lg text-pearl-white/80 max-w-2xl font-light leading-relaxed">
          Certified Gold Jewellery, Italian Anti-Oxidation Silver, Transparent Gold Buying & Expert Repair Services in Nowshera. Owned & operated by <strong class="text-gold-accent">Gul Nawaz Khan</strong>.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
          <a href="<?= $base_url ?>/collections.php" class="w-full sm:w-auto px-8 py-4 bg-gold-accent hover:bg-gold-light text-navy-deep font-heading font-bold text-xs uppercase tracking-[0.15em] rounded transition-all hover:-translate-y-0.5 shadow-luxury-md hover:shadow-gold-glow text-center">
            Explore Collections
          </a>
          <a href="https://maps.app.goo.gl/JdAjigKyJQ2xyWEo9" target="_blank" class="w-full sm:w-auto px-8 py-4 bg-transparent border border-pearl-white/40 hover:border-gold-accent hover:text-gold-accent text-pearl-white font-heading font-semibold text-xs uppercase tracking-[0.15em] rounded transition-all text-center">
            Visit Our Store
          </a>
          <a href="<?= $base_url ?>/contact.php" class="w-full sm:w-auto px-8 py-4 bg-transparent border border-pearl-white/40 hover:border-gold-accent hover:text-gold-accent text-pearl-white font-heading font-semibold text-xs uppercase tracking-[0.15em] rounded transition-all text-center">
            Contact Us
          </a>
        </div>

        <!-- Trust Badges -->
        <div class="pt-8 border-t border-pearl-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-navy-royal flex items-center justify-center text-gold-accent border border-gold-accent/20 shrink-0">🥇</div>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wide text-pearl-white">24K & 21K Gold</h4>
              <p class="text-[11px] text-pearl-white/60">Certified Purity</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-navy-royal flex items-center justify-center text-gold-accent border border-gold-accent/20 shrink-0">✨</div>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wide text-pearl-white">Italian Silver</h4>
              <p class="text-[11px] text-pearl-white/60">Anti-Oxidation</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-navy-royal flex items-center justify-center text-gold-accent border border-gold-accent/20 shrink-0">⚖️</div>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wide text-pearl-white">Gold Buying</h4>
              <p class="text-[11px] text-pearl-white/60">12.150 / Cut Formula</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-navy-royal flex items-center justify-center text-gold-accent border border-gold-accent/20 shrink-0">🛠️</div>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wide text-pearl-white">In-House Repair</h4>
              <p class="text-[11px] text-pearl-white/60">Same-Day Service</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Hero Image (Pure Gold Jewellery) -->
      <div class="lg:col-span-5 relative flex justify-center">
        <div class="relative w-full max-w-md">
          <div class="absolute -inset-3 rounded-2xl bg-gradient-to-br from-gold-accent/20 via-transparent to-gold-accent/10 blur-xl opacity-60"></div>
          <div class="relative bg-navy-royal p-3 rounded-2xl border border-gold-accent/25 shadow-luxury-lg overflow-hidden group">
            <img src="<?= $base_url ?>/assets/images/hero.png" alt="Pure Gold Jewellery Set at Fahad Jewellery Nowshera" class="w-full h-auto object-cover rounded-xl group-hover:scale-105 transition-transform duration-700">
            <div class="absolute bottom-5 left-5 right-5 bg-navy-deep/90 backdrop-blur-sm p-3.5 rounded-xl border border-gold-accent/30 shadow-luxury-md">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-gold-accent">Pure Gold Collection</span>
                  <h3 class="font-serif-luxury text-sm font-semibold text-pearl-white leading-snug">24K & 21K Pakistani Gold</h3>
                  <p class="text-[11px] text-pearl-white/60">Gul Nawaz Khan — Est. 2010</p>
                </div>
                <a href="<?= $base_url ?>/collections.php" class="shrink-0 px-3 py-1.5 bg-gold-accent hover:bg-gold-light text-navy-deep font-heading font-bold text-[10px] uppercase tracking-wider rounded transition-colors">
                  View
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     2. LIVE GOLD RATES BAR
═══════════════════════════════════════════════════════════ -->
<div class="bg-navy-royal text-pearl-white py-3 px-4 border-b border-navy-deep/50 overflow-hidden">
  <div class="max-w-7xl mx-auto flex flex-wrap gap-x-8 gap-y-1 items-center justify-between text-xs font-heading font-semibold uppercase tracking-wider">
    <span class="text-gold-accent">Today's Gold & Silver Rate <span class="text-pearl-white/40 font-normal">|</span> <?= date('d M Y') ?></span>
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <span>24K Gold: <span class="text-gold-accent">Rs. <?= number_format($rates['gold_24k']) ?>/Tola</span></span>
      <span>21K Gold: <span class="text-gold-accent">Rs. <?= number_format($rates['gold_21k']) ?>/Tola</span></span>
      <span>Normal Silver: <span class="text-pearl-white/70">Rs. <?= number_format($rates['silver_normal']) ?>/Tola</span></span>
      <span>Italian Silver: <span class="text-gold-light">Rs. <?= number_format($rates['silver_italian']) ?>/Tola</span></span>
    </div>
    <a href="<?= $base_url ?>/gold-rates.php" class="text-gold-accent hover:text-gold-light underline decoration-dotted text-[11px]">Calculator & Details →</a>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     3. FEATURED COLLECTIONS SHOWCASE
═══════════════════════════════════════════════════════════ -->
<section id="collections" class="py-16 bg-pearl-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
      <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">Signature Collections</span>
      <h2 class="font-serif-luxury text-3xl sm:text-4xl font-bold text-navy-deep">Pure Gold & Italian Silver Pieces</h2>
      <p class="text-muted-gray text-sm">Certified 24K and 21K Gold Jewellery alongside Anti-Oxidation Italian Silver crafted to exact weight standards.</p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <button class="tab-btn bg-navy-deep text-pearl-white px-5 py-2.5 rounded font-heading text-xs font-bold uppercase tracking-wider transition-all" data-category="all">All</button>
      <button class="tab-btn bg-transparent text-onyx px-5 py-2.5 rounded border border-border-silver font-heading text-xs font-bold uppercase tracking-wider transition-all hover:bg-ivory-surface" data-category="gold_bridal">Bridal Sets</button>
      <button class="tab-btn bg-transparent text-onyx px-5 py-2.5 rounded border border-border-silver font-heading text-xs font-bold uppercase tracking-wider transition-all hover:bg-ivory-surface" data-category="gold_bangles">Gold Bangles</button>
      <button class="tab-btn bg-transparent text-onyx px-5 py-2.5 rounded border border-border-silver font-heading text-xs font-bold uppercase tracking-wider transition-all hover:bg-ivory-surface" data-category="gold_chains">Gold Chains</button>
      <button class="tab-btn bg-transparent text-onyx px-5 py-2.5 rounded border border-border-silver font-heading text-xs font-bold uppercase tracking-wider transition-all hover:bg-ivory-surface" data-category="gold_rings">Gold Rings</button>
      <button class="tab-btn bg-transparent text-onyx px-5 py-2.5 rounded border border-border-silver font-heading text-xs font-bold uppercase tracking-wider transition-all hover:bg-ivory-surface" data-category="earrings">Earrings</button>
      <button class="tab-btn bg-transparent text-onyx px-5 py-2.5 rounded border border-border-silver font-heading text-xs font-bold uppercase tracking-wider transition-all hover:bg-ivory-surface" data-category="silver">Italian & Normal Silver</button>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <?php foreach ($featured_products as $product): ?>
      <div class="product-card group bg-pearl-white rounded border border-border-silver overflow-hidden shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-300 flex flex-col" data-category="<?= htmlspecialchars($product['category']) ?>">
        <div class="relative overflow-hidden bg-ivory-surface aspect-square">
          <img src="<?= $base_url ?>/assets/images/<?= htmlspecialchars($product['image']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute top-3 left-3">
            <span class="bg-gold-accent text-navy-deep text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm"><?= htmlspecialchars($product['purity']) ?></span>
          </div>
          <div class="card-overlay absolute inset-0 bg-navy-deep/60 flex items-end p-4">
            <button class="btn-enquire w-full py-2.5 bg-gold-accent hover:bg-gold-light text-navy-deep font-heading font-bold text-xs uppercase tracking-wider rounded transition-colors" data-name="<?= htmlspecialchars($product['name']) ?>">
              Enquire Price & Details
            </button>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 class="font-serif-luxury text-base font-semibold text-navy-deep group-hover:text-gold-accent transition-colors leading-snug"><?= htmlspecialchars($product['name']) ?></h3>
            <p class="text-xs text-muted-gray mt-1 leading-relaxed line-clamp-2"><?= htmlspecialchars($product['description']) ?></p>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-border-silver">
            <div>
              <span class="font-heading font-bold text-base text-navy-deep">Rs. <?= number_format($product['price_pkr']) ?></span>
              <p class="text-[10px] text-muted-gray"><?= $product['weight_tola'] ?> Tola · <?= $product['purity'] ?></p>
            </div>
            <button class="btn-enquire px-4 py-2 bg-navy-deep hover:bg-gold-accent text-pearl-white hover:text-navy-deep font-heading text-xs font-bold uppercase tracking-wider rounded transition-colors" data-name="<?= htmlspecialchars($product['name']) ?>">
              Enquire
            </button>
          </div>
        </div>
      </div>
      <?php endforeach; ?>
    </div>

    <div class="text-center mt-10">
      <a href="<?= $base_url ?>/collections.php" class="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-navy-deep hover:bg-navy-deep hover:text-pearl-white text-navy-deep font-heading font-bold text-xs uppercase tracking-widest rounded transition-all duration-300">
        View All 36 Ready Stock Items
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     4. WHAT WE OFFER (SERVICES CARDS WITH VIEWPORT SCROLL)
═══════════════════════════════════════════════════════════ -->
<section id="services-overview" class="py-16 bg-navy-deep text-pearl-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
      <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">What We Offer</span>
      <h2 class="font-serif-luxury text-3xl sm:text-4xl font-bold text-pearl-white">Our Jewellery Services</h2>
      <p class="text-pearl-white/60 text-sm">Click any service card below to view its full details.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <?php
      $services = [
        ['emoji'=>'🪙','title'=>'Gold Buying','desc'=>'Transparent gold valuation using the official 12.150 & Cut formula. Immediate payment.','target'=>'services.php#buying'],
        ['emoji'=>'💰','title'=>'Gold Selling','desc'=>'Purchase certified 24K and 21K gold pieces with weight hallmark verification.','target'=>'services.php#selling'],
        ['emoji'=>'🔧','title'=>'Jewellery Repair','desc'=>'Artisan chain soldering, clasp fixes, and stone re-setting by skilled goldsmiths.','target'=>'services.php#repair'],
        ['emoji'=>'✨','title'=>'Cleaning & Polishing','desc'=>'Ultrasonic cleaning and high-shine polish for gold and Italian anti-oxidation silver.','target'=>'services.php#polishing'],
        ['emoji'=>'💍','title'=>'Ring Resizing','desc'=>'Accurate gold and silver ring resizing without altering hallmark stamps.','target'=>'services.php#resize'],
        ['emoji'=>'🤝','title'=>'Jewellery Consultation','desc'=>'Personal consultation with Gul Nawaz Khan for bridal sets or custom orders.','target'=>'contact.php'],
      ];
      foreach ($services as $s): ?>
      <a href="<?= $base_url ?>/<?= $s['target'] ?>" class="bg-navy-royal p-6 rounded-xl border border-gold-accent/15 hover:border-gold-accent/50 transition-all duration-300 group block">
        <div class="text-3xl mb-3"><?= $s['emoji'] ?></div>
        <h3 class="font-heading font-bold text-sm uppercase tracking-wider text-pearl-white group-hover:text-gold-accent transition-colors mb-2"><?= $s['title'] ?></h3>
        <p class="text-xs text-pearl-white/60 leading-relaxed mb-4"><?= $s['desc'] ?></p>
        <span class="text-gold-accent hover:text-gold-light text-[11px] font-heading font-bold uppercase tracking-wider inline-flex items-center gap-1">
          Learn More
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </span>
      </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     5. ABOUT SECTION (OWNER IMAGE FIXED)
═══════════════════════════════════════════════════════════ -->
<section id="about" class="py-16 bg-ivory-surface border-y border-border-silver">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <!-- Image: Owner.png -->
      <div class="lg:col-span-5">
        <div class="relative rounded-2xl overflow-hidden shadow-luxury-md border border-border-silver group">
          <img src="<?= $base_url ?>/assets/images/Owner.png" alt="Gul Nawaz Khan – Founder & Owner of Fahad Jewellery Nowshera" class="w-full object-cover group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 text-pearl-white">
            <span class="font-script text-2xl text-gold-accent block">Est. 2010</span>
            <h3 class="font-serif-luxury text-lg font-bold">Gul Nawaz Khan</h3>
            <p class="text-xs text-pearl-white/70">Founder & Owner – Fahad Jewellery</p>
          </div>
        </div>
      </div>
      <!-- Content -->
      <div class="lg:col-span-7 space-y-5">
        <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">Our Story</span>
        <h2 class="font-serif-luxury text-3xl sm:text-4xl font-bold text-navy-deep leading-tight">
          A Family Business Built on Trust & Honest Service
        </h2>
        <p class="text-muted-gray text-base leading-relaxed">
          Fahad Jewellery was established in 2010 by <strong class="text-navy-deep">Gul Nawaz Khan</strong> in Nowshera, KPK. Built on a simple promise of honest weights, certified 24K & 21K gold purity, and fair market gold buying rates, we have served hundreds of families across Nowshera for over 15 years.
        </p>
        <div class="grid grid-cols-3 gap-4 pt-2">
          <div class="text-center bg-pearl-white p-4 rounded border border-border-silver shadow-luxury-sm">
            <div class="font-serif-luxury text-2xl font-bold text-navy-deep">15+</div>
            <div class="text-xs text-muted-gray">Years in Business</div>
          </div>
          <div class="text-center bg-pearl-white p-4 rounded border border-border-silver shadow-luxury-sm">
            <div class="font-serif-luxury text-2xl font-bold text-navy-deep">24K & 21K</div>
            <div class="text-xs text-muted-gray">Certified Gold</div>
          </div>
          <div class="text-center bg-pearl-white p-4 rounded border border-border-silver shadow-luxury-sm">
            <div class="font-serif-luxury text-2xl font-bold text-navy-deep">100%</div>
            <div class="text-xs text-muted-gray">Transparent Rates</div>
          </div>
        </div>
        <a href="<?= $base_url ?>/about.php" class="inline-flex items-center gap-2 px-7 py-3 bg-navy-deep hover:bg-gold-accent hover:text-navy-deep text-pearl-white font-heading font-bold text-xs uppercase tracking-widest rounded transition-all duration-300">
          Our Full Story
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     6. STORE HOURS & LOCATION
═══════════════════════════════════════════════════════════ -->
<section class="py-16 bg-navy-deep text-pearl-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-5">
        <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">Visit Our Shop</span>
        <h2 class="font-serif-luxury text-3xl sm:text-4xl font-bold text-pearl-white">Fahad Jewellery Store Location</h2>
        <p class="text-pearl-white/70 text-sm leading-relaxed">Visit Gul Nawaz Khan at our shop in Nowshera. We welcome you to view our ready stock, discuss custom orders, or sell gold.</p>
        <div class="space-y-3 text-sm">
          <div class="flex items-start gap-3"><span class="text-gold-accent text-xl">📍</span><div><span class="text-pearl-white font-semibold block">Nowshera, KPK, Pakistan</span><a href="https://maps.app.goo.gl/JdAjigKyJQ2xyWEo9" target="_blank" class="text-gold-accent hover:text-gold-light underline decoration-dotted text-xs">Get Directions on Google Maps</a></div></div>
          <div class="flex items-center gap-3"><span class="text-gold-accent text-xl">📞</span><div><a href="tel:03339013157" class="text-pearl-white hover:text-gold-accent">0333-9013157</a> &nbsp;/&nbsp; <a href="tel:03149653366" class="text-pearl-white hover:text-gold-accent">0314-9653366</a></div></div>
          <div class="flex items-start gap-3"><span class="text-gold-accent text-xl">🕒</span><div><span class="text-gold-light font-semibold">Saturday – Thursday:</span> 10:00 AM – 7:00 PM<br><span class="text-rose-300 font-semibold">Friday: Closed</span></div></div>
        </div>
      </div>
      <!-- Google Map -->
      <div class="rounded-2xl overflow-hidden shadow-luxury-lg border border-gold-accent/20 h-80">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.5!2d71.9847!3d34.0157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d914e0b9fce97f%3A0x95c4f0f7a1484b25!2sNowshera%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1690000000000!5m2!1sen!2s" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy" title="Fahad Jewellery Location"></iframe>
      </div>
    </div>
  </div>
</section>

<!-- ENQUIRY MODAL -->
<div id="enquiry-modal" class="hidden fixed inset-0 z-50 bg-navy-deep/80 backdrop-blur-sm items-center justify-center p-4">
  <div class="bg-pearl-white rounded-2xl max-w-lg w-full shadow-luxury-lg border border-border-silver relative">
    <button id="modal-close" class="absolute top-4 right-4 text-navy-deep hover:text-gold-accent p-1">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="p-7 space-y-5">
      <div>
        <span class="text-xs font-heading font-bold uppercase tracking-widest text-gold-accent">Product Enquiry</span>
        <h3 class="font-serif-luxury text-2xl font-bold text-navy-deep mt-1">Get Price & Weight Details</h3>
        <p class="text-xs text-muted-gray mt-1">Product: <span id="modal-product-name" class="font-semibold text-navy-deep">—</span></p>
      </div>
      <form id="enquiry-form" class="space-y-4">
        <input type="hidden" name="product_name" id="form-product-name">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-heading font-bold uppercase text-navy-deep tracking-wider">Your Name *</label>
            <input type="text" name="name" required placeholder="e.g. Tariq Khan" class="mt-1 w-full px-3 py-2.5 border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent">
          </div>
          <div>
            <label class="text-xs font-heading font-bold uppercase text-navy-deep tracking-wider">Phone Number *</label>
            <input type="tel" name="phone" required placeholder="0333-XXXXXXX" class="mt-1 w-full px-3 py-2.5 border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent">
          </div>
        </div>
        <div>
          <label class="text-xs font-heading font-bold uppercase text-navy-deep tracking-wider">Message *</label>
          <textarea name="message" required rows="3" placeholder="Tell us what you would like to know..." class="mt-1 w-full px-3 py-2.5 border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent resize-none"></textarea>
        </div>
        <button type="submit" class="w-full py-3 bg-navy-deep hover:bg-gold-accent text-pearl-white hover:text-navy-deep font-heading font-bold text-xs uppercase tracking-widest rounded transition-colors">
          Send Enquiry
        </button>
      </form>
    </div>
  </div>
</div>

<?php include 'includes/footer.php'; ?>
