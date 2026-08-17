<?php
// collections.php – Gold & Silver Jewellery Collections (Phase 2 Updated)
require_once 'config/db.php';
$base_url = '/fahad_jewellery';

$page_title       = 'Jewellery Collections – Fahad Jewellery Nowshera | 24K & 21K Gold & Italian Silver';
$page_description = 'Browse complete collections of Certified 24K & 21K Gold Bridal Sets, Gold Bangles, Chains, Rings, Earrings, and Italian Anti-Oxidation Silver at Fahad Jewellery Nowshera.';

$selected_cat = trim(htmlspecialchars($_GET['cat'] ?? 'all'));

$where_clause = "WHERE is_available = 1";
if ($selected_cat !== 'all') {
    $cat_safe = $conn ? $conn->real_escape_string($selected_cat) : $selected_cat;
    $where_clause .= " AND category = '$cat_safe'";
}

$products = [];
if ($conn) {
    $res = $conn->query("SELECT * FROM products $where_clause ORDER BY is_featured DESC, id DESC");
    if ($res) {
        while ($row = $res->fetch_assoc()) $products[] = $row;
    }
}

include 'includes/header.php';
?>

<!-- HERO HEADER -->
<section class="bg-navy-deep text-pearl-white py-14 border-b border-gold-accent/20 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
    <span class="text-xs font-heading font-bold uppercase tracking-[0.25em] text-gold-accent">Certified Purity Standards</span>
    <h1 class="font-serif-luxury text-4xl sm:text-5xl font-bold">Jewellery Collections</h1>
    <p class="text-pearl-white/70 max-w-xl mx-auto text-sm">Every item features verified weight in Tola and guaranteed 24K Gold, 21K Gold, Normal Silver, or Italian Anti-Oxidation Silver purity.</p>
  </div>
</section>

<!-- MAIN CONTENT -->
<section class="py-12 bg-pearl-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Category Navigation Bar -->
    <div class="flex flex-wrap items-center justify-center gap-2 mb-10 pb-6 border-b border-border-silver">
      <?php
      $categories = [
        'all'         => 'All Collections (36 Items)',
        'gold_bridal' => 'Bridal Gold Sets',
        'gold_bangles'=> 'Gold Bangles (Kara)',
        'gold_chains' => 'Gold Chains (Mala)',
        'gold_rings'  => 'Gold Rings',
        'earrings'    => 'Earrings & Jhumke',
        'silver'      => 'Italian & Normal Silver',
      ];
      foreach ($categories as $key => $label):
        $active = ($selected_cat === $key);
        $cls    = $active
          ? 'bg-navy-deep text-pearl-white shadow-luxury-sm'
          : 'bg-ivory-surface text-onyx hover:bg-navy-deep/10 border border-border-silver';
      ?>
      <a href="?cat=<?= $key ?>" class="px-5 py-2.5 rounded font-heading text-xs font-bold uppercase tracking-wider transition-all <?= $cls ?>">
        <?= $label ?>
      </a>
      <?php endforeach; ?>
    </div>

    <!-- Products Grid -->
    <?php if (empty($products)): ?>
    <div class="text-center py-16 bg-ivory-surface rounded-xl border border-border-silver space-y-4">
      <div class="text-4xl">👑</div>
      <h3 class="font-serif-luxury text-xl font-bold text-navy-deep">No Products Found in This Category</h3>
      <p class="text-xs text-muted-gray">Please select another category or contact Gul Nawaz Khan directly for custom orders.</p>
      <a href="?cat=all" class="inline-block px-6 py-2.5 bg-navy-deep text-pearl-white font-heading text-xs uppercase tracking-widest rounded">View All Products</a>
    </div>
    <?php else: ?>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <?php foreach ($products as $p): ?>
      <div class="group bg-pearl-white rounded-xl border border-border-silver overflow-hidden shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-300 flex flex-col">
        <div class="relative overflow-hidden bg-ivory-surface aspect-square">
          <img src="<?= $base_url ?>/assets/images/<?= htmlspecialchars($p['image']) ?>" alt="<?= htmlspecialchars($p['name']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute top-3 left-3 flex gap-2">
            <span class="bg-gold-accent text-navy-deep text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm"><?= htmlspecialchars($p['purity']) ?></span>
            <?php if (!empty($p['weight_tola'])): ?>
            <span class="bg-navy-deep text-pearl-white text-[10px] font-heading font-semibold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm"><?= $p['weight_tola'] ?> Tola</span>
            <?php endif; ?>
          </div>
          <div class="card-overlay absolute inset-0 bg-navy-deep/60 flex items-end p-4">
            <button class="btn-enquire w-full py-3 bg-gold-accent hover:bg-gold-light text-navy-deep font-heading font-bold text-xs uppercase tracking-wider rounded transition-colors" data-name="<?= htmlspecialchars($p['name']) ?>">
              Enquire Price & Details
            </button>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 class="font-serif-luxury text-lg font-semibold text-navy-deep group-hover:text-gold-accent transition-colors leading-snug"><?= htmlspecialchars($p['name']) ?></h3>
            <p class="text-xs text-muted-gray mt-1 leading-relaxed line-clamp-2"><?= htmlspecialchars($p['description']) ?></p>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-border-silver">
            <div>
              <span class="font-heading font-bold text-base text-navy-deep">Rs. <?= number_format($p['price_pkr']) ?></span>
              <p class="text-[10px] text-muted-gray">Weight: <?= $p['weight_tola'] ?> Tola</p>
            </div>
            <button class="btn-enquire px-4 py-2 bg-navy-deep hover:bg-gold-accent text-pearl-white hover:text-navy-deep font-heading text-xs font-bold uppercase tracking-wider rounded transition-colors" data-name="<?= htmlspecialchars($p['name']) ?>">
              Enquire
            </button>
          </div>
        </div>
      </div>
      <?php endforeach; ?>
    </div>

    <?php endif; ?>

    <!-- Custom Order Callout -->
    <div class="mt-16 bg-navy-deep text-pearl-white p-8 rounded-2xl border border-gold-accent/30 text-center space-y-4">
      <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">Custom Jewellery Orders</span>
      <h3 class="font-serif-luxury text-2xl sm:text-3xl font-bold">Have a Custom Gold Design in Mind?</h3>
      <p class="text-xs sm:text-sm text-pearl-white/70 max-w-xl mx-auto">Bring your own photo or drawing. Gul Nawaz Khan can craft custom gold sets, rings, bangles, and bridal jewellery to your exact specifications.</p>
      <div class="pt-2">
        <a href="https://wa.me/923339013157?text=Assalam%20o%20Alaikum!%20I%20want%20to%20order%20custom%20gold%20jewellery." target="_blank" class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#1da851] text-white font-heading font-bold text-xs uppercase tracking-widest rounded transition-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Discuss Custom Order on WhatsApp
        </a>
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
        <h3 class="font-serif-luxury text-2xl font-bold text-navy-deep mt-1">Get Price & Availability</h3>
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
          <textarea name="message" required rows="3" placeholder="I would like to check the exact price, weight, and availability of this item..." class="mt-1 w-full px-3 py-2.5 border border-border-silver rounded text-sm text-navy-deep focus:outline-none focus:border-gold-accent resize-none"></textarea>
        </div>
        <button type="submit" class="w-full py-3 bg-navy-deep hover:bg-gold-accent text-pearl-white hover:text-navy-deep font-heading font-bold text-xs uppercase tracking-widest rounded transition-colors">
          Submit Enquiry
        </button>
      </form>
    </div>
  </div>
</div>

<?php include 'includes/footer.php'; ?>
