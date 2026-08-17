<?php
// gold-rates.php – Today's Gold Rates & Customer Gold Price Calculator (Phase 3)
require_once 'config/db.php';
require_once 'handlers/gold_rate_api.php';
$base_url = '/fahad_jewellery';

$rates = get_latest_gold_rates($conn);

// Fetch settings from DB
$labour_cost_pkr = 2000.0;
$tola_weight_g   = 12.0;

if ($conn) {
    $res = $conn->query("SELECT setting_key, setting_value FROM settings");
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            if ($row['setting_key'] === 'labour_cost_pkr')   $labour_cost_pkr = floatval($row['setting_value']);
            if ($row['setting_key'] === 'tola_weight_grams') $tola_weight_g   = floatval($row['setting_value']);
        }
    }
}

// Per-gram values — based on 1 Tola = 12g standard
$rate_24k_gram        = round($rates['gold_24k'] / $tola_weight_g, 2);
$rate_21k_gram        = round($rates['gold_21k'] / $tola_weight_g, 2);
$rate_normal_silver_g = round($rates['silver_normal'] / $tola_weight_g, 2);
$rate_ital_silver_g   = round($rates['silver_italian'] / $tola_weight_g, 2);

$page_title       = "Today's Gold & Silver Rates in Nowshera (PKR) – Fahad Jewellery";
$page_description = 'Daily updated Gold Rates in Nowshera (PKR per Tola & Gram) for 24K & 21K Gold, Normal Silver and Italian Anti-Oxidation Silver. Gold Price Calculator by Fahad Jewellery.';

include 'includes/header.php';
?>

<!-- HERO HEADER -->
<section class="bg-navy-deep text-pearl-white py-14 border-b border-gold-accent/20 relative overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(197,160,89,0.1)_0%,_transparent_60%)] pointer-events-none"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
    <span class="text-xs font-heading font-bold uppercase tracking-[0.25em] text-gold-accent">Live Market Rates</span>
    <h1 class="font-serif-luxury text-4xl sm:text-5xl font-bold">Daily Gold &amp; Silver Rates</h1>
    <p class="text-pearl-white/70 max-w-xl mx-auto text-sm">Nowshera, Khyber Pakhtunkhwa &middot; Updated <?= date('d M Y', strtotime($rates['rate_date'])) ?></p>
  </div>
</section>

<!-- MAIN CONTENT -->
<section class="py-14 bg-pearl-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

    <!-- ═══════════════════════════════════
         CURRENT RATES CARDS
    ════════════════════════════════════ -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <!-- 24K Gold -->
      <div class="rate-card-gold p-6 rounded-2xl border border-gold-accent/40 shadow-luxury-md text-pearl-white space-y-3 relative overflow-hidden">
        <div class="absolute -top-6 -right-6 w-24 h-24 bg-gold-accent/10 rounded-full blur-xl"></div>
        <div class="flex justify-between items-start relative z-10">
          <span class="bg-gold-accent text-navy-deep font-heading font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded">24K Pure Gold</span>
          <span class="text-xs text-gold-light/80 font-mono">100% Pure</span>
        </div>
        <div class="relative z-10">
          <div class="text-xs text-pearl-white/70">Per Tola (<?= $tola_weight_g ?>g)</div>
          <div class="font-serif-luxury text-3xl font-bold text-gold-accent mt-1">Rs. <?= number_format($rates['gold_24k']) ?></div>
        </div>
        <div class="pt-3 border-t border-pearl-white/10 flex justify-between text-xs text-pearl-white/70 relative z-10">
          <span>Per Gram:</span>
          <span class="font-bold text-pearl-white">Rs. <?= number_format($rate_24k_gram, 2) ?></span>
        </div>
      </div>

      <!-- 21K Gold -->
      <div class="rate-card-gold p-6 rounded-2xl border border-gold-accent/40 shadow-luxury-md text-pearl-white space-y-3 relative overflow-hidden">
        <div class="absolute -top-6 -right-6 w-24 h-24 bg-gold-accent/10 rounded-full blur-xl"></div>
        <div class="flex justify-between items-start relative z-10">
          <span class="bg-gold-accent text-navy-deep font-heading font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded">21K Jewellery Gold</span>
          <span class="text-xs text-gold-light/80 font-mono">Standard</span>
        </div>
        <div class="relative z-10">
          <div class="text-xs text-pearl-white/70">Per Tola (<?= $tola_weight_g ?>g)</div>
          <div class="font-serif-luxury text-3xl font-bold text-gold-accent mt-1">Rs. <?= number_format($rates['gold_21k']) ?></div>
        </div>
        <div class="pt-3 border-t border-pearl-white/10 flex justify-between text-xs text-pearl-white/70 relative z-10">
          <span>Per Gram:</span>
          <span class="font-bold text-pearl-white">Rs. <?= number_format($rate_21k_gram, 2) ?></span>
        </div>
      </div>

      <!-- Normal Silver — distinct silver metallic styling -->
      <div class="p-6 rounded-2xl border border-slate-400/40 shadow-luxury-md space-y-3 relative overflow-hidden"
           style="background: linear-gradient(135deg, #3a3f4b 0%, #2c3040 60%, #1e2230 100%);">
        <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl" style="background:rgba(148,163,184,0.15)"></div>
        <div class="flex justify-between items-start relative z-10">
          <span class="font-heading font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded"
                style="background:#94a3b8;color:#0f172a;">Normal Silver</span>
          <span class="text-xs font-mono" style="color:#94a3b8;">Chandi</span>
        </div>
        <div class="relative z-10">
          <div class="text-xs" style="color:#94a3b8;">Per Tola (<?= $tola_weight_g ?>g)</div>
          <div class="font-serif-luxury text-3xl font-bold mt-1" style="color:#e2e8f0;">Rs. <?= number_format($rates['silver_normal']) ?></div>
        </div>
        <div class="pt-3 border-t flex justify-between text-xs relative z-10" style="border-color:rgba(148,163,184,0.2);color:#94a3b8;">
          <span>Per Gram:</span>
          <span class="font-bold" style="color:#e2e8f0;">Rs. <?= number_format($rate_normal_silver_g, 2) ?></span>
        </div>
      </div>

      <!-- Italian Silver — premium steel-toned styling -->
      <div class="p-6 rounded-2xl border shadow-luxury-md space-y-3 relative overflow-hidden"
           style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1a2340 100%); border-color: rgba(148,163,184,0.5);">
        <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl" style="background:rgba(203,213,225,0.1)"></div>
        <div class="flex justify-between items-start relative z-10">
          <span class="font-heading font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded"
                style="background: linear-gradient(90deg,#cbd5e1,#94a3b8); color:#0f172a;">Italian Silver</span>
          <span class="text-xs font-mono" style="color:#cbd5e1;">Anti-Oxidation</span>
        </div>
        <div class="relative z-10">
          <div class="text-xs" style="color:#94a3b8;">Per Tola (<?= $tola_weight_g ?>g)</div>
          <div class="font-serif-luxury text-3xl font-bold mt-1" style="color:#f1f5f9;">Rs. <?= number_format($rates['silver_italian']) ?></div>
        </div>
        <div class="pt-3 border-t flex justify-between text-xs relative z-10" style="border-color:rgba(148,163,184,0.2);color:#94a3b8;">
          <span>Per Gram:</span>
          <span class="font-bold" style="color:#f1f5f9;">Rs. <?= number_format($rate_ital_silver_g, 2) ?></span>
        </div>
      </div>

    </div><!-- /grid cards -->

    <!-- ═══════════════════════════════════
         GOLD PRICE CALCULATOR (Customer)
    ════════════════════════════════════ -->
    <div class="bg-ivory-surface p-8 sm:p-10 rounded-2xl border border-border-silver shadow-luxury-sm max-w-3xl mx-auto space-y-6">
      <div class="text-center space-y-1">
        <span class="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold-accent">Fahad Jewellery</span>
        <h2 class="font-serif-luxury text-2xl sm:text-3xl font-bold text-navy-deep">Gold Price Calculator</h2>
        <p class="text-xs text-muted-gray">Estimate the price of your jewellery purchase based on current gold rates.</p>
      </div>

      <!-- Inputs Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <!-- Purity -->
        <div>
          <label class="block text-xs font-heading font-bold uppercase text-navy-deep mb-1">Gold Purity</label>
          <select id="calc-purity" class="w-full px-3 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:border-gold-accent focus:outline-none">
            <option value="<?= $rates['gold_24k'] ?>">24K Pure Gold</option>
            <option value="<?= $rates['gold_21k'] ?>" selected>21K Jewellery Gold</option>
            <option value="<?= $rates['silver_normal'] ?>">Normal Silver</option>
            <option value="<?= $rates['silver_italian'] ?>">Italian Silver</option>
          </select>
        </div>

        <!-- Weight input — Tola -->
        <div>
          <label class="block text-xs font-heading font-bold uppercase text-navy-deep mb-1">Weight</label>
          <div class="flex gap-2">
            <input type="number" id="calc-weight-tola" placeholder="e.g. 2.5" step="0.001" min="0.01"
                   class="w-full px-3 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:border-gold-accent focus:outline-none">
            <select id="calc-unit" class="px-2 py-3 bg-pearl-white border border-border-silver rounded text-xs text-navy-deep focus:border-gold-accent focus:outline-none">
              <option value="tola">Tola</option>
              <option value="gram">Grams</option>
            </select>
          </div>
          <span class="text-[10px] text-muted-gray">1 Tola = <?= $tola_weight_g ?>g</span>
        </div>

        <!-- Labour Charges -->
        <div>
          <label class="block text-xs font-heading font-bold uppercase text-navy-deep mb-1">Labour Charges (PKR / Tola)</label>
          <input type="number" id="calc-labour" value="<?= $labour_cost_pkr ?>" step="100" min="0"
                 class="w-full px-3 py-3 bg-pearl-white border border-border-silver rounded text-sm text-navy-deep focus:border-gold-accent focus:outline-none">
          <span class="text-[10px] text-muted-gray">Default: Rs. <?= number_format($labour_cost_pkr) ?>/Tola</span>
        </div>

        <!-- Current Rate display (read-only) -->
        <div>
          <label class="block text-xs font-heading font-bold uppercase text-navy-deep mb-1">Current Rate (Auto)</label>
          <div id="current-rate-display"
               class="w-full px-3 py-3 bg-navy-deep/5 border border-border-silver rounded text-sm font-bold text-navy-deep">
            Rs. <?= number_format($rates['gold_21k']) ?> / Tola
          </div>
        </div>

      </div>

      <!-- Result Display -->
      <div class="bg-navy-deep text-pearl-white p-6 rounded-xl border border-gold-accent/30 text-center space-y-2">
        <span class="text-[11px] uppercase tracking-widest text-gold-accent font-heading font-bold">Estimated Price (PKR)</span>
        <div id="calc-result" class="font-serif-luxury text-4xl font-bold text-gold-accent">Rs. 0</div>
        <div class="text-[11px] text-pearl-white/60 grid grid-cols-2 gap-x-6 gap-y-1 max-w-xs mx-auto pt-2 text-left">
          <span>Gold Value:</span><span id="breakdown-gold" class="font-semibold text-right">Rs. 0</span>
          <span>Labour:</span><span id="breakdown-labour" class="font-semibold text-right">Rs. 0</span>
        </div>
        <p class="text-[11px] text-pearl-white/40 pt-1">*Final price subject to physical weight verification at Fahad Jewellery, Nowshera.</p>
      </div>

    </div>

    <!-- INFO NOTE -->
    <div class="max-w-3xl mx-auto text-center">
      <p class="text-xs text-muted-gray leading-relaxed">
        Rates shown are for Nowshera, KPK local Sarafa market and are updated by Fahad Jewellery daily.<br>
        <strong class="text-navy-deep">1 Tola = <?= $tola_weight_g ?>g</strong> &middot; Gold Purity: 24K &amp; 21K Only &middot; Silver: Normal &amp; Italian Anti-Oxidation
      </p>
    </div>

  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function () {
  const TOLA_GRAMS   = <?= $tola_weight_g ?>;
  const LABOUR_RATE  = <?= $labour_cost_pkr ?>; // PKR per Tola default

  const purityEl     = document.getElementById('calc-purity');
  const weightEl     = document.getElementById('calc-weight-tola');
  const unitEl       = document.getElementById('calc-unit');
  const labourEl     = document.getElementById('calc-labour');
  const resultEl     = document.getElementById('calc-result');
  const rateDisplay  = document.getElementById('current-rate-display');
  const brkGold      = document.getElementById('breakdown-gold');
  const brkLabour    = document.getElementById('breakdown-labour');

  function fmt(n) {
    return 'Rs. ' + Math.round(n).toLocaleString('en-PK');
  }

  function calculate() {
    const ratePerTola = parseFloat(purityEl.value) || 0;
    const rawWeight   = parseFloat(weightEl.value) || 0;
    const unit        = unitEl.value;
    const labour      = parseFloat(labourEl.value) || 0;

    // Convert weight to Tola
    let weightTola = (unit === 'gram') ? rawWeight / TOLA_GRAMS : rawWeight;

    const ratePerGram  = ratePerTola / TOLA_GRAMS;
    const weightGrams  = weightTola * TOLA_GRAMS;
    const goldValue    = ratePerGram * weightGrams;
    const labourTotal  = labour * weightTola;
    const total        = goldValue + labourTotal;

    resultEl.textContent = fmt(total);
    brkGold.textContent  = fmt(goldValue);
    brkLabour.textContent = fmt(labourTotal);
    rateDisplay.textContent = fmt(ratePerTola) + ' / Tola';
  }

  [purityEl, weightEl, unitEl, labourEl].forEach(el => el.addEventListener('input', calculate));
  calculate();
});
</script>

<?php include 'includes/footer.php'; ?>
