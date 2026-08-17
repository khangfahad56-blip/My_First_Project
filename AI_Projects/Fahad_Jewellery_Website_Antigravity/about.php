<?php
// about.php – About Fahad Jewellery & Gul Nawaz Khan (Phase 2 Updated)
require_once 'config/db.php';
$base_url = '/fahad_jewellery';

$page_title       = 'About Us – Fahad Jewellery Nowshera | Gul Nawaz Khan';
$page_description = 'Learn about Fahad Jewellery, established in 2010 by Gul Nawaz Khan in Nowshera, KPK. Certified 24K & 21K Gold and Italian Silver.';

include 'includes/header.php';
?>

<!-- HERO HEADER -->
<section class="bg-navy-deep text-pearl-white py-16 border-b border-gold-accent/20 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
    <span class="text-xs font-heading font-bold uppercase tracking-[0.25em] text-gold-accent">Est. 2010 · Nowshera, KPK</span>
    <h1 class="font-serif-luxury text-4xl sm:text-5xl font-bold">About Fahad Jewellery</h1>
    <p class="text-pearl-white/70 max-w-2xl mx-auto text-sm sm:text-base">Built on principles of trust, gold purity, and fair pricing — serving families across Nowshera for over 15 years.</p>
  </div>
</section>

<!-- OWNER & STORY SECTION (Owner.png image used) -->
<section class="py-16 bg-pearl-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      <div class="lg:col-span-5">
        <div class="relative rounded-2xl overflow-hidden shadow-luxury-lg border border-border-silver group">
          <img src="<?= $base_url ?>/assets/images/Owner.png" alt="Gul Nawaz Khan – Founder & Owner of Fahad Jewellery" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 text-pearl-white">
            <span class="font-script text-2xl text-gold-accent">Established 2010</span>
            <h3 class="font-serif-luxury text-xl font-bold">Gul Nawaz Khan</h3>
            <p class="text-xs text-pearl-white/70">Founder & Owner — Fahad Jewellery</p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 space-y-5">
        <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">Our Journey</span>
        <h2 class="font-serif-luxury text-3xl sm:text-4xl font-bold text-navy-deep leading-tight">
          Over 15 Years of Honesty, Authenticity & Craftsmanship
        </h2>
        <p class="text-muted-gray text-base leading-relaxed">
          Fahad Jewellery was founded in 2010 by <strong class="text-navy-deep">Gul Nawaz Khan</strong> in Nowshera, Khyber Pakhtunkhwa. Starting with a humble shop and a simple mission to provide authentic 24K and 21K gold jewellery alongside Italian anti-oxidation silver, the business has grown into one of the most trusted names in the local community.
        </p>

        <!-- Key Highlights Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="bg-ivory-surface p-4 rounded border border-border-silver flex items-start gap-3">
            <div class="text-gold-accent text-xl mt-0.5">🥇</div>
            <div>
              <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-navy-deep">Guaranteed 24K & 21K Gold</h4>
              <p class="text-[11px] text-muted-gray">Zero compromise on gold purity. Every piece is tested and certified.</p>
            </div>
          </div>
          <div class="bg-ivory-surface p-4 rounded border border-border-silver flex items-start gap-3">
            <div class="text-gold-accent text-xl mt-0.5">✨</div>
            <div>
              <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-navy-deep">Italian Anti-Oxidation Silver</h4>
              <p class="text-[11px] text-muted-gray">Premium Italian silver crafted with mirror finish anti-tarnish coating.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>
