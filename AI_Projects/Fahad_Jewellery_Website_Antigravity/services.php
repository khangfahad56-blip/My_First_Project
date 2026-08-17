<?php
// services.php – Gold & Jewellery Services (Phase 2 Updated)
require_once 'config/db.php';
$base_url = '/fahad_jewellery';

$page_title       = 'Jewellery Services – Gold Buying, Selling, Repair, Polishing & Resizing | Fahad Jewellery';
$page_description = 'Comprehensive gold services in Nowshera: Gold Buying (12.150 / cut formula), Gold Selling (certified 24K & 21K), In-house Jewellery Repair, Polishing & Ring Resizing by Gul Nawaz Khan.';

include 'includes/header.php';
?>

<!-- HERO HEADER -->
<section class="bg-navy-deep text-pearl-white py-14 border-b border-gold-accent/20 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
    <span class="text-xs font-heading font-bold uppercase tracking-[0.25em] text-gold-accent">Complete Gold Care</span>
    <h1 class="font-serif-luxury text-4xl sm:text-5xl font-bold">Our Jewellery Services</h1>
    <p class="text-pearl-white/70 max-w-xl mx-auto text-sm">Professional gold buying, gold selling, artisan repairs, polishing, and ring resizing in Nowshera under the personal supervision of Gul Nawaz Khan.</p>
  </div>
</section>

<!-- SERVICES DETAILED LIST -->
<section class="py-16 bg-pearl-white space-y-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

    <!-- 1. GOLD BUYING (Title fixed: Gold Buying) -->
    <div id="buying" class="bg-ivory-surface p-8 sm:p-10 rounded-2xl border border-border-silver shadow-luxury-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-28">
      <div class="lg:col-span-4 text-center lg:text-left">
        <div class="w-16 h-16 rounded-full bg-gold-accent/10 border border-gold-accent/40 text-gold-accent text-3xl flex items-center justify-center mb-4 mx-auto lg:mx-0">🪙</div>
        <span class="text-xs font-heading font-bold uppercase tracking-widest text-gold-accent">Service 01</span>
        <h2 class="font-serif-luxury text-3xl font-bold text-navy-deep mt-1">Gold Buying</h2>
      </div>
      <div class="lg:col-span-8 space-y-4 text-sm text-muted-gray leading-relaxed">
        <p>Want to sell your old gold, broken jewellery, or gold coins? At Fahad Jewellery, we provide an honest valuation based on the official Pakistani formula: <code class="font-mono text-navy-deep bg-pearl-white px-2 py-1 rounded">(Rate / 12.150) × (Cut / 12) × Weight</code>.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-navy-deep">
          <div class="flex items-center gap-2"><span class="text-gold-accent">✓</span> Digital scale weight verification</div>
          <div class="flex items-center gap-2"><span class="text-gold-accent">✓</span> Karat assessment (24K, 21K)</div>
          <div class="flex items-center gap-2"><span class="text-gold-accent">✓</span> Immediate cash payout</div>
          <div class="flex items-center gap-2"><span class="text-gold-accent">✓</span> Transparent cut calculation</div>
        </div>
        <div class="pt-2">
          <a href="https://wa.me/923339013157?text=Assalam%20o%20Alaikum!%20I%20want%20to%20sell%20my%20gold." target="_blank" class="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-deep text-pearl-white font-heading font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-accent hover:text-navy-deep transition-colors">
            Request Gold Valuation
          </a>
        </div>
      </div>
    </div>

    <!-- 2. GOLD SELLING -->
    <div id="selling" class="bg-ivory-surface p-8 sm:p-10 rounded-2xl border border-border-silver shadow-luxury-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-28">
      <div class="lg:col-span-4 text-center lg:text-left">
        <div class="w-16 h-16 rounded-full bg-gold-accent/10 border border-gold-accent/40 text-gold-accent text-3xl flex items-center justify-center mb-4 mx-auto lg:mx-0">💰</div>
        <span class="text-xs font-heading font-bold uppercase tracking-widest text-gold-accent">Service 02</span>
        <h2 class="font-serif-luxury text-3xl font-bold text-navy-deep mt-1">Gold & Silver Selling</h2>
      </div>
      <div class="lg:col-span-8 space-y-4 text-sm text-muted-gray leading-relaxed">
        <p>Purchase certified 24K and 21K gold items alongside anti-oxidation Italian silver pieces with complete peace of mind.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-navy-deep">
          <div class="flex items-center gap-2"><span class="text-gold-accent">✓</span> 100% Purity Guarantee on 24K & 21K</div>
          <div class="flex items-center gap-2"><span class="text-gold-accent">✓</span> Italian Anti-Oxidation Silver</div>
        </div>
        <div class="pt-2">
          <a href="<?= $base_url ?>/collections.php" class="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-deep text-pearl-white font-heading font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-accent hover:text-navy-deep transition-colors">
            Explore Ready Stock
          </a>
        </div>
      </div>
    </div>

    <!-- 3. JEWELLERY REPAIR -->
    <div id="repair" class="bg-ivory-surface p-8 sm:p-10 rounded-2xl border border-border-silver shadow-luxury-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-28">
      <div class="lg:col-span-4 text-center lg:text-left">
        <div class="w-16 h-16 rounded-full bg-gold-accent/10 border border-gold-accent/40 text-gold-accent text-3xl flex items-center justify-center mb-4 mx-auto lg:mx-0">🔧</div>
        <span class="text-xs font-heading font-bold uppercase tracking-widest text-gold-accent">Service 03</span>
        <h2 class="font-serif-luxury text-3xl font-bold text-navy-deep mt-1">Artisan Jewellery Repair</h2>
      </div>
      <div class="lg:col-span-8 space-y-4 text-sm text-muted-gray leading-relaxed">
        <p>Chain soldering, clasp fixes, and structural repairs performed in-house by experienced goldsmiths.</p>
        <div class="pt-2">
          <a href="tel:03339013157" class="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-deep text-pearl-white font-heading font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-accent hover:text-navy-deep transition-colors">
            Call for Repair Advice: 0333-9013157
          </a>
        </div>
      </div>
    </div>

    <!-- 4. POLISHING & CLEANING (CTA Button Added) -->
    <div id="polishing" class="bg-ivory-surface p-8 sm:p-10 rounded-2xl border border-border-silver shadow-luxury-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-28">
      <div class="lg:col-span-4 text-center lg:text-left">
        <div class="w-16 h-16 rounded-full bg-gold-accent/10 border border-gold-accent/40 text-gold-accent text-3xl flex items-center justify-center mb-4 mx-auto lg:mx-0">✨</div>
        <span class="text-xs font-heading font-bold uppercase tracking-widest text-gold-accent">Service 04</span>
        <h2 class="font-serif-luxury text-3xl font-bold text-navy-deep mt-1">Cleaning & Polishing</h2>
      </div>
      <div class="lg:col-span-8 space-y-4 text-sm text-muted-gray leading-relaxed">
        <p>Restore the showroom mirror polish to dull or tarnished gold and silver jewellery using professional ultrasonic cleaning.</p>
        <div class="pt-2">
          <a href="<?= $base_url ?>/contact.php" class="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-deep text-pearl-white font-heading font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-accent hover:text-navy-deep transition-colors">
            Request Polishing Service
          </a>
        </div>
      </div>
    </div>

    <!-- 5. RING RESIZING (CTA Button Added) -->
    <div id="resize" class="bg-ivory-surface p-8 sm:p-10 rounded-2xl border border-border-silver shadow-luxury-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-28">
      <div class="lg:col-span-4 text-center lg:text-left">
        <div class="w-16 h-16 rounded-full bg-gold-accent/10 border border-gold-accent/40 text-gold-accent text-3xl flex items-center justify-center mb-4 mx-auto lg:mx-0">💍</div>
        <span class="text-xs font-heading font-bold uppercase tracking-widest text-gold-accent">Service 05</span>
        <h2 class="font-serif-luxury text-3xl font-bold text-navy-deep mt-1">Ring Resizing</h2>
      </div>
      <div class="lg:col-span-8 space-y-4 text-sm text-muted-gray leading-relaxed">
        <p>Accurate gold and silver ring enlargement or reduction without altering hallmark stamps or gemstone settings.</p>
        <div class="pt-2">
          <a href="<?= $base_url ?>/contact.php" class="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-deep text-pearl-white font-heading font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-accent hover:text-navy-deep transition-colors">
            Book Ring Resizing
          </a>
        </div>
      </div>
    </div>

  </div>
</section>

<?php include 'includes/footer.php'; ?>
