<?php
// contact.php – Contact Us & Store Hours (Phase 2 Updated)
require_once 'config/db.php';
$base_url = '/fahad_jewellery';

$page_title       = 'Contact Us – Fahad Jewellery Nowshera | Location & Timings';
$page_description = 'Contact Fahad Jewellery in Nowshera, KPK. Phone: 0333-9013157, 0314-9653366. Owned by Gul Nawaz Khan. Saturday – Thursday: 10:00 AM – 7:00 PM (Friday Closed).';

include 'includes/header.php';
?>

<!-- HERO HEADER -->
<section class="bg-navy-deep text-pearl-white py-14 border-b border-gold-accent/20 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
    <span class="text-xs font-heading font-bold uppercase tracking-[0.25em] text-gold-accent">We're Here to Help</span>
    <h1 class="font-serif-luxury text-4xl sm:text-5xl font-bold">Contact Fahad Jewellery</h1>
    <p class="text-pearl-white/70 max-w-xl mx-auto text-sm">Visit Gul Nawaz Khan at our shop in Nowshera or send an enquiry below.</p>
  </div>
</section>

<!-- MAIN CONTENT -->
<section class="py-14 bg-pearl-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">

      <!-- LEFT: CONTACT CARDS & INFO -->
      <div class="lg:col-span-5 space-y-6">

        <div class="space-y-4">

          <!-- Location -->
          <div class="bg-ivory-surface p-5 rounded-xl border border-border-silver flex items-start gap-4 shadow-luxury-sm">
            <div class="w-11 h-11 rounded-full bg-navy-deep text-gold-accent flex items-center justify-center shrink-0 text-xl">📍</div>
            <div>
              <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-navy-deep">Store Location</h4>
              <p class="text-xs text-muted-gray mt-1">Fahad Jewellery, Main Market, Nowshera, KPK, Pakistan.</p>
              <a href="https://maps.app.goo.gl/JdAjigKyJQ2xyWEo9" target="_blank" class="text-gold-accent hover:text-navy-deep font-heading text-[11px] font-bold uppercase tracking-wider mt-2 inline-block underline decoration-dotted">
                Open in Google Maps →
              </a>
            </div>
          </div>

          <!-- Phone Numbers -->
          <div class="bg-ivory-surface p-5 rounded-xl border border-border-silver flex items-start gap-4 shadow-luxury-sm">
            <div class="w-11 h-11 rounded-full bg-navy-deep text-gold-accent flex items-center justify-center shrink-0 text-xl">📞</div>
            <div>
              <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-navy-deep">Phone Contacts</h4>
              <div class="mt-1 space-y-1 text-xs text-muted-gray">
                <div>Primary: <a href="tel:03339013157" class="text-navy-deep font-semibold hover:text-gold-accent">0333-9013157</a></div>
                <div>Secondary: <a href="tel:03149653366" class="text-navy-deep font-semibold hover:text-gold-accent">0314-9653366</a></div>
              </div>
            </div>
          </div>

          <!-- Business Hours (Saturday - Thursday 10am-7pm, Friday Closed) -->
          <div class="bg-ivory-surface p-5 rounded-xl border border-border-silver flex items-start gap-4 shadow-luxury-sm">
            <div class="w-11 h-11 rounded-full bg-navy-deep text-gold-accent flex items-center justify-center shrink-0 text-xl">🕒</div>
            <div>
              <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-navy-deep">Business Hours</h4>
              <div class="mt-1 space-y-1 text-xs text-muted-gray">
                <div class="text-navy-deep font-semibold">Saturday – Thursday: 10:00 AM – 7:00 PM</div>
                <div class="text-rose-600 font-semibold">Friday: Closed</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- RIGHT: ONLINE ENQUIRY FORM -->
      <div class="lg:col-span-7 bg-ivory-surface p-8 sm:p-10 rounded-2xl border border-border-silver shadow-luxury-sm">
        <div class="space-y-2 mb-6">
          <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">Send a Message</span>
          <h2 class="font-serif-luxury text-2xl sm:text-3xl font-bold text-navy-deep">Online Contact & Enquiry Form</h2>
        </div>

        <form id="enquiry-form" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-heading font-bold uppercase text-navy-deep tracking-wider mb-1">Your Full Name *</label>
              <input type="text" name="name" required placeholder="e.g. Tariq Khan" class="w-full px-4 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent">
            </div>
            <div>
              <label class="block text-xs font-heading font-bold uppercase text-navy-deep tracking-wider mb-1">Mobile Phone Number *</label>
              <input type="tel" name="phone" required placeholder="0333-1234567" class="w-full px-4 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-heading font-bold uppercase text-navy-deep tracking-wider mb-1">Email Address (Optional)</label>
              <input type="email" name="email" placeholder="name@domain.com" class="w-full px-4 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent">
            </div>
            <div>
              <label class="block text-xs font-heading font-bold uppercase text-navy-deep tracking-wider mb-1">Service Type</label>
              <select name="service" class="w-full px-4 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent">
                <option value="general">General Enquiry / Price Check</option>
                <option value="gold_buying">Sell Gold to Us (Gold Buying)</option>
                <option value="gold_selling">Buy Gold from Us (24K/21K/Silver)</option>
                <option value="repair">Jewellery Repair</option>
                <option value="polishing">Jewellery Polishing</option>
                <option value="resize">Ring Resizing</option>
                <option value="custom_order">Custom Design Order</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-heading font-bold uppercase text-navy-deep tracking-wider mb-1">Your Message *</label>
            <textarea name="message" required rows="5" placeholder="Please describe the jewellery item or service you are interested in..." class="w-full px-4 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent resize-none"></textarea>
          </div>

          <button type="submit" class="w-full py-4 bg-navy-deep hover:bg-gold-accent text-pearl-white hover:text-navy-deep font-heading font-bold text-xs uppercase tracking-widest rounded transition-all duration-300 shadow-luxury-md">
            Submit Contact Enquiry
          </button>
        </form>
      </div>

    </div>

  </div>
</section>

<?php include 'includes/footer.php'; ?>
