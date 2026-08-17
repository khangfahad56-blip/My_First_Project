<?php
// includes/footer.php – Shared footer (Phase 2 Updated)
$base_url = $base_url ?? '/fahad_jewellery';
?>
<!-- FLOATING WHATSAPP BUTTON -->
<a href="https://wa.me/923339013157?text=Assalam%20o%20Alaikum!%20I%20am%20interested%20in%20Fahad%20Jewellery%20services."
   target="_blank"
   class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-luxury-lg hover:scale-110 transition-transform duration-300 whatsapp-pulse no-print"
   title="Chat on WhatsApp – 0333-9013157">
  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
</a>

<!-- TOAST NOTIFICATION -->
<div id="toast" class="fixed bottom-24 right-6 z-50 transform translate-y-20 opacity-0 bg-navy-deep text-pearl-white px-5 py-3 rounded border border-gold-accent/40 shadow-luxury-lg flex items-center gap-3 no-print">
  <div class="w-2 h-2 rounded-full bg-gold-accent"></div>
  <span id="toast-message" class="text-xs font-medium">Message sent.</span>
</div>

<!-- MAIN FOOTER -->
<footer class="bg-navy-deep text-pearl-white pt-14 pb-8 border-t border-navy-royal mt-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Gold shimmer divider -->
    <div class="h-px gold-shimmer mb-12 opacity-30"></div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-navy-royal/60">

      <!-- Brand Column -->
      <div class="space-y-4 lg:col-span-1">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gold-accent flex items-center justify-center text-navy-deep font-serif-luxury font-bold text-lg">F</div>
          <div>
            <div class="font-serif-luxury text-xl font-bold tracking-widest text-pearl-white">FAHAD</div>
            <div class="text-[9px] tracking-widest font-heading text-gold-accent uppercase">Gold & Silver Jewellery</div>
          </div>
        </div>
        <p class="text-xs text-pearl-white/70 leading-relaxed">
          Established in 2010 by <strong class="text-gold-accent">Gul Nawaz Khan</strong>, Fahad Jewellery is a trusted family business in Nowshera specializing in certified 24K & 21K Gold and Italian Anti-Oxidation Silver.
        </p>
        <div class="flex items-center gap-2 text-xs text-gold-accent font-semibold">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          <a href="https://maps.app.goo.gl/JdAjigKyJQ2xyWEo9" target="_blank" class="hover:text-gold-light underline decoration-dotted">Nowshera, KPK, Pakistan</a>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="space-y-4">
        <h4 class="font-heading text-xs font-bold uppercase tracking-widest text-gold-accent">Quick Links</h4>
        <ul class="space-y-2 text-xs text-pearl-white/70">
          <li><a href="<?= $base_url ?>/index.php"       class="hover:text-pearl-white transition-colors">Home</a></li>
          <li><a href="<?= $base_url ?>/collections.php" class="hover:text-pearl-white transition-colors">Gold & Silver Collections</a></li>
          <li><a href="<?= $base_url ?>/services.php"    class="hover:text-pearl-white transition-colors">Our Services</a></li>
          <li><a href="<?= $base_url ?>/gold-rates.php"  class="hover:text-pearl-white transition-colors">Today's Gold Rates</a></li>
          <li><a href="<?= $base_url ?>/about.php"       class="hover:text-pearl-white transition-colors">About Us</a></li>
          <li><a href="<?= $base_url ?>/contact.php"     class="hover:text-pearl-white transition-colors">Contact Us</a></li>
        </ul>
      </div>

      <!-- Services (Mirrors Services Page) -->
      <div class="space-y-4">
        <h4 class="font-heading text-xs font-bold uppercase tracking-widest text-gold-accent">Our Services</h4>
        <ul class="space-y-2 text-xs text-pearl-white/70">
          <li><a href="<?= $base_url ?>/services.php#buying"   class="hover:text-pearl-white transition-colors">Gold Buying</a></li>
          <li><a href="<?= $base_url ?>/services.php#selling"  class="hover:text-pearl-white transition-colors">Gold Selling</a></li>
          <li><a href="<?= $base_url ?>/services.php#repair"   class="hover:text-pearl-white transition-colors">Jewellery Repair</a></li>
          <li><a href="<?= $base_url ?>/services.php#polishing" class="hover:text-pearl-white transition-colors">Jewellery Polishing</a></li>
          <li><a href="<?= $base_url ?>/services.php#resize"   class="hover:text-pearl-white transition-colors">Ring Resizing</a></li>
        </ul>
      </div>

      <!-- Contact & Business Hours -->
      <div class="space-y-4">
        <h4 class="font-heading text-xs font-bold uppercase tracking-widest text-gold-accent">Store Hours & Contact</h4>
        <div class="space-y-3 text-xs text-pearl-white/70">
          <div class="flex gap-2">
            <svg class="w-4 h-4 text-gold-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <div>
              <a href="tel:03339013157" class="block hover:text-pearl-white">0333-9013157</a>
              <a href="tel:03149653366" class="block hover:text-pearl-white">0314-9653366</a>
            </div>
          </div>
          <div class="flex gap-2">
            <svg class="w-4 h-4 text-gold-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <div class="text-gold-light font-semibold">Saturday – Thursday:</div>
              <div>10:00 AM – 7:00 PM</div>
              <div class="text-rose-300 font-semibold mt-1">Friday: Closed</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Copyright -->
    <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pearl-white/40">
      <p>&copy; <?= date('Y') ?> Fahad Jewellery – Gul Nawaz Khan. All Rights Reserved. Nowshera, KPK, Pakistan.</p>
      <div class="flex items-center gap-4 text-[10px] uppercase tracking-wider">
        <a href="<?= $base_url ?>/gold-rates.php" class="hover:text-gold-accent">Gold Rates</a>
        <span>•</span>
        <a href="<?= $base_url ?>/contact.php" class="hover:text-gold-accent">Contact</a>
        <span>•</span>
        <a href="<?= $base_url ?>/admin/login.php" class="hover:text-gold-accent">Admin Portal</a>
      </div>
    </div>
  </div>
</footer>

<!-- MAIN JS -->
<script src="<?= $base_url ?>/assets/js/app.js"></script>
</body>
</html>
