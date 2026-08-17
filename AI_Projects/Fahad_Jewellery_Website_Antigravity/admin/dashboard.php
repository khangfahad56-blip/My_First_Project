<?php
// admin/dashboard.php – Full Business Management Dashboard (Phase 3)
session_start();
require_once '../config/db.php';
require_once '../handlers/gold_rate_api.php';
$base_url = '/fahad_jewellery';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: login.php');
    exit;
}

$msg  = '';
$mtype = 'success'; // 'success' or 'error'
$tab  = trim(htmlspecialchars($_GET['tab'] ?? 'dashboard'));

// ── 1. UPDATE GOLD & SILVER RATES ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_rates'])) {
    $g24 = floatval($_POST['gold_24k']);
    $g21 = floatval($_POST['gold_21k']);
    $sn  = floatval($_POST['silver_normal']);
    $si  = floatval($_POST['silver_italian']);
    $today = date('Y-m-d');
    if ($conn) {
        $stmt = $conn->prepare("INSERT INTO gold_rates (gold_24k, gold_21k, silver_normal, silver_italian, rate_date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE gold_24k=?, gold_21k=?, silver_normal=?, silver_italian=?");
        $stmt->bind_param('ddddsdddd', $g24, $g21, $sn, $si, $today, $g24, $g21, $sn, $si);
        $msg = $stmt->execute() ? "Gold & Silver rates updated for $today." : 'Error: ' . $conn->error;
    }
}

// ── 2. UPDATE FORMULA SETTINGS ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_settings'])) {
    $pairs = [
        'tola_weight_grams' => floatval($_POST['tola_weight_grams']),
        'labour_cost_pkr'   => floatval($_POST['labour_cost_pkr']),
        'buy_cut_default'   => floatval($_POST['buy_cut_default']),
        'buy_divisor'       => floatval($_POST['buy_divisor']),
        'sell_divisor'      => floatval($_POST['sell_divisor']),
        'store_hours'       => trim($_POST['store_hours']),
    ];
    if ($conn) {
        $stmt = $conn->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value=?");
        foreach ($pairs as $key => $val) {
            $v = (string)$val;
            $stmt->bind_param('sss', $key, $v, $v);
            $stmt->execute();
        }
        $msg = 'Formula Settings saved successfully.';
    }
}

// ── 3. ADD NEW PRODUCT ─────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_product'])) {
    $p_name  = trim($_POST['name']);
    $p_cat   = $_POST['category'];
    $p_desc  = trim($_POST['description']);
    $p_wt    = floatval($_POST['weight_tola']);
    $p_pur   = $_POST['purity'];
    $p_pkr   = floatval($_POST['price_pkr']);
    $p_feat  = isset($_POST['is_featured']) ? 1 : 0;

    // Handle image upload
    $p_img = 'bridal_set.png';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $ext      = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $allowed  = ['jpg', 'jpeg', 'png', 'webp'];
        if (in_array($ext, $allowed)) {
            $fname = 'product_' . time() . '.' . $ext;
            $dest  = '../assets/images/' . $fname;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
                $p_img = $fname;
            }
        }
    } elseif (!empty($_POST['image'])) {
        $p_img = trim($_POST['image']);
    }

    if ($conn) {
        $stmt = $conn->prepare("INSERT INTO products (name, category, description, weight_tola, purity, price_pkr, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('sssdsdsi', $p_name, $p_cat, $p_desc, $p_wt, $p_pur, $p_pkr, $p_img, $p_feat);
        $msg = $stmt->execute() ? 'Product added to inventory.' : 'Error: ' . $conn->error;
    }
}

// ── 4. EDIT PRODUCT ────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_product'])) {
    $id     = intval($_POST['product_id']);
    $p_name = trim($_POST['name']);
    $p_cat  = $_POST['category'];
    $p_desc = trim($_POST['description']);
    $p_wt   = floatval($_POST['weight_tola']);
    $p_pur  = $_POST['purity'];
    $p_pkr  = floatval($_POST['price_pkr']);
    $p_feat = isset($_POST['is_featured']) ? 1 : 0;
    $p_avail= isset($_POST['is_available']) ? 1 : 0;
    $p_img  = trim($_POST['image']);

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg','jpeg','png','webp'])) {
            $fname = 'product_' . time() . '.' . $ext;
            if (move_uploaded_file($_FILES['image']['tmp_name'], '../assets/images/' . $fname)) {
                $p_img = $fname;
            }
        }
    }

    if ($conn) {
        $stmt = $conn->prepare("UPDATE products SET name=?, category=?, description=?, weight_tola=?, purity=?, price_pkr=?, image=?, is_featured=?, is_available=? WHERE id=?");
        $stmt->bind_param('sssdsdssii', $p_name, $p_cat, $p_desc, $p_wt, $p_pur, $p_pkr, $p_img, $p_feat, $p_avail, $id);
        $msg = $stmt->execute() ? 'Product updated successfully.' : 'Error: ' . $conn->error;
    }
}

// ── 5. DELETE PRODUCT ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_product'])) {
    $id = intval($_POST['product_id']);
    if ($conn) {
        $conn->query("DELETE FROM products WHERE id=$id");
        $msg = 'Product deleted from inventory.';
    }
}

// ── 6. TOGGLE PRODUCT AVAILABILITY ────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['toggle_product'])) {
    $id   = intval($_POST['product_id']);
    $avail = intval($_POST['current_avail']) ? 0 : 1;
    if ($conn) {
        $conn->query("UPDATE products SET is_available=$avail WHERE id=$id");
        $msg = 'Product availability updated.';
    }
}

// ── 7. UPDATE ENQUIRY ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_enquiry'])) {
    $id      = intval($_POST['enquiry_id']);
    $status  = $_POST['eq_status'];
    $urgency = $_POST['eq_urgency'];
    $note    = trim($_POST['internal_note']);
    $is_read = isset($_POST['is_read']) ? 1 : 0;
    if ($conn) {
        $stmt = $conn->prepare("UPDATE enquiries SET status=?, urgency=?, internal_note=?, is_read=? WHERE id=?");
        $stmt->bind_param('sssii', $status, $urgency, $note, $is_read, $id);
        $stmt->execute();
        $msg = 'Enquiry updated.';
    }
}

// ── 8. DELETE ENQUIRY ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_enquiry'])) {
    $id = intval($_POST['enquiry_id']);
    if ($conn) { $conn->query("DELETE FROM enquiries WHERE id=$id"); }
    $msg = 'Enquiry deleted.';
}

// ── 9. ADD NOTE ────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_note'])) {
    $n_title = trim($_POST['title']);
    $n_text  = trim($_POST['note_text']);
    if ($conn && !empty($n_title)) {
        $stmt = $conn->prepare("INSERT INTO notes (title, note_text) VALUES (?, ?)");
        $stmt->bind_param('ss', $n_title, $n_text);
        $stmt->execute();
        $msg = 'Note saved.';
    }
}

// ── FETCH DATA ─────────────────────────────────────────────────────────────
$current_rates = get_latest_gold_rates($conn);

$settings = [];
if ($conn) {
    $res = $conn->query("SELECT setting_key, setting_value FROM settings");
    if ($res) while ($r = $res->fetch_assoc()) $settings[$r['setting_key']] = $r['setting_value'];
}
$tola_w      = $settings['tola_weight_grams'] ?? 12;
$labour_cost = $settings['labour_cost_pkr']   ?? 2000;
$buy_cut     = $settings['buy_cut_default']   ?? 9.5;
$buy_div     = $settings['buy_divisor']       ?? 12.150;
$sell_div    = $settings['sell_divisor']      ?? 12;
$store_hours = $settings['store_hours']       ?? 'Saturday – Thursday: 10:00 AM – 7:00 PM | Friday: Closed';

$total_products    = 0;
$total_enquiries   = 0;
$pending_enquiries = 0;
$unread_enquiries  = 0;

if ($conn) {
    $r1 = $conn->query("SELECT COUNT(*) c FROM products");
    if ($r1 && $row = $r1->fetch_assoc()) $total_products = intval($row['c']);

    $r2 = $conn->query("SELECT COUNT(*) c FROM enquiries");
    if ($r2 && $row = $r2->fetch_assoc()) $total_enquiries = intval($row['c']);

    $r3 = $conn->query("SELECT COUNT(*) c FROM enquiries WHERE status='pending'");
    if ($r3 && $row = $r3->fetch_assoc()) $pending_enquiries = intval($row['c']);

    $r4 = $conn->query("SELECT COUNT(*) c FROM enquiries WHERE is_read=0");
    if ($r4 && $row = $r4->fetch_assoc()) $unread_enquiries = intval($row['c']);
}

$products_list  = [];
$cat_filter     = $_GET['cat'] ?? '';
$purity_filter  = $_GET['purity'] ?? '';
$prod_sql = "SELECT * FROM products WHERE 1=1";
if ($cat_filter)   $prod_sql .= " AND category='" . $conn->real_escape_string($cat_filter) . "'";
if ($purity_filter)$prod_sql .= " AND purity='" . $conn->real_escape_string($purity_filter) . "'";
$prod_sql .= " ORDER BY id DESC LIMIT 50";
if ($conn) { $r = $conn->query($prod_sql); if ($r) while ($row = $r->fetch_assoc()) $products_list[] = $row; }

$eq_filter   = $_GET['eq_status'] ?? '';
$eq_urgency  = $_GET['eq_urgency'] ?? '';
$eq_sql      = "SELECT * FROM enquiries WHERE 1=1";
if ($eq_filter)  $eq_sql .= " AND status='"   . $conn->real_escape_string($eq_filter) . "'";
if ($eq_urgency) $eq_sql .= " AND urgency='" . $conn->real_escape_string($eq_urgency) . "'";
$eq_sql .= " ORDER BY id DESC LIMIT 50";
$enquiries_list = [];
if ($conn) { $r = $conn->query($eq_sql); if ($r) while ($row = $r->fetch_assoc()) $enquiries_list[] = $row; }

$notes_list = [];
if ($conn) { $r = $conn->query("SELECT * FROM notes ORDER BY id DESC LIMIT 10"); if ($r) while ($row = $r->fetch_assoc()) $notes_list[] = $row; }

// For edit modal — fetch single product if edit_id param set
$edit_product = null;
if (isset($_GET['edit_id']) && $conn) {
    $eid = intval($_GET['edit_id']);
    $r = $conn->query("SELECT * FROM products WHERE id=$eid LIMIT 1");
    if ($r) $edit_product = $r->fetch_assoc();
}

// For edit enquiry modal
$edit_enquiry = null;
if (isset($_GET['eq_edit']) && $conn) {
    $eid = intval($_GET['eq_edit']);
    $r = $conn->query("SELECT * FROM enquiries WHERE id=$eid LIMIT 1");
    if ($r) $edit_enquiry = $r->fetch_assoc();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fahad Jewellery — Admin Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root { --gold: #c5a059; --gold-light: #dbb978; --navy: #0a1628; }
    .gold-text { color: var(--gold); }
    .badge-pending  { background:#fef3c7; color:#92400e; }
    .badge-completed{ background:#d1fae5; color:#065f46; }
    .badge-cancelled{ background:#fee2e2; color:#991b1b; }
    .badge-high  { background:#fee2e2; color:#991b1b; }
    .badge-normal{ background:#e0f2fe; color:#0369a1; }
    .badge-low   { background:#f0fdf4; color:#166534; }
    [x-cloak] { display:none; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen">

<!-- TOP APP BAR -->
<header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xl">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-serif font-bold text-lg flex items-center justify-center shadow">F</div>
    <div>
      <h1 class="font-serif font-bold text-base text-slate-100">Fahad Jewellery — Admin</h1>
      <p class="text-[11px] text-slate-400">Gul Nawaz Khan · Nowshera, KPK</p>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <a href="<?= $base_url ?>/index.php" target="_blank" class="text-xs text-amber-400 hover:underline hidden sm:block">View Website ↗</a>
    <a href="dashboard.php?action=logout" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded transition-colors">Logout</a>
  </div>
</header>

<div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

  <?php if ($msg): ?>
  <div class="bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-sm p-4 rounded-lg flex justify-between items-center">
    <span>✓ <?= htmlspecialchars($msg) ?></span>
    <button onclick="this.parentElement.remove()" class="text-emerald-300 font-bold text-lg leading-none">&times;</button>
  </div>
  <?php endif; ?>

  <!-- TAB NAVIGATION -->
  <nav class="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
    <?php
    $tabs = [
      'dashboard' => ['icon'=>'📊', 'label'=>'Dashboard'],
      'rates'     => ['icon'=>'💰', 'label'=>'Gold & Silver Rates'],
      'products'  => ['icon'=>'💎', 'label'=>'Products'],
      'enquiries' => ['icon'=>'📩', 'label'=>"Messages ($pending_enquiries pending)"],
      'notes'     => ['icon'=>'📝', 'label'=>'Notes'],
      'settings'  => ['icon'=>'⚙️', 'label'=>'Formula Settings'],
      'calculator'=> ['icon'=>'🧮', 'label'=>'Admin Calculator'],
    ];
    foreach ($tabs as $key => $info):
      $active = ($tab === $key) ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800';
    ?>
    <a href="?tab=<?= $key ?>" class="px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-colors <?= $active ?>">
      <?= $info['icon'] ?> <?= $info['label'] ?>
    </a>
    <?php endforeach; ?>
  </nav>


  <!-- ══════════════════════════════════════════════
       MODULE 1: DASHBOARD OVERVIEW
  ═══════════════════════════════════════════════ -->
  <?php if ($tab === 'dashboard'): ?>
  <div class="space-y-8">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">24K Gold Today</div>
        <div class="text-2xl font-bold text-amber-400 font-serif mt-1">Rs. <?= number_format($current_rates['gold_24k']) ?></div>
        <div class="text-[11px] text-slate-500">Per Tola (<?= $tola_w ?>g)</div>
      </div>
      <div class="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">21K Gold Today</div>
        <div class="text-2xl font-bold text-amber-400 font-serif mt-1">Rs. <?= number_format($current_rates['gold_21k']) ?></div>
        <div class="text-[11px] text-slate-500">Jewellery Standard</div>
      </div>
      <div class="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Inventory</div>
        <div class="text-2xl font-bold text-slate-100 font-serif mt-1"><?= $total_products ?> Items</div>
        <div class="text-[11px] text-slate-500">6 Categories</div>
      </div>
      <div class="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Messages</div>
        <div class="text-2xl font-bold text-emerald-400 font-serif mt-1"><?= $pending_enquiries ?></div>
        <div class="text-[11px] text-slate-500"><?= $unread_enquiries ?> unread · Total: <?= $total_enquiries ?></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Rate Summary -->
      <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 class="font-serif font-bold text-amber-400">Today's Market Rate Summary</h3>
        <div class="divide-y divide-slate-800 text-sm">
          <div class="py-2.5 flex justify-between"><span>24K Pure Gold</span><span class="font-bold text-amber-400">Rs. <?= number_format($current_rates['gold_24k']) ?></span></div>
          <div class="py-2.5 flex justify-between"><span>21K Standard Gold</span><span class="font-bold text-amber-400">Rs. <?= number_format($current_rates['gold_21k']) ?></span></div>
          <div class="py-2.5 flex justify-between"><span>Normal Silver (Chandi)</span><span class="font-bold text-slate-200">Rs. <?= number_format($current_rates['silver_normal']) ?></span></div>
          <div class="py-2.5 flex justify-between"><span>Italian Silver</span><span class="font-bold text-slate-200">Rs. <?= number_format($current_rates['silver_italian']) ?></span></div>
        </div>
        <a href="?tab=rates" class="inline-block mt-2 px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded">Update Rates</a>
      </div>
      <!-- Store Info -->
      <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
        <h3 class="font-serif font-bold text-slate-100">Store Details</h3>
        <div class="space-y-3 text-sm text-slate-300">
          <div><span class="text-slate-500 block text-xs">Owner:</span><strong class="text-slate-100">Gul Nawaz Khan</strong></div>
          <div><span class="text-slate-500 block text-xs">Location:</span>Main Market, Nowshera, KPK, Pakistan</div>
          <div><span class="text-slate-500 block text-xs">Hours:</span><?= htmlspecialchars($store_hours) ?></div>
          <div><span class="text-slate-500 block text-xs">Active Formula Settings:</span>1 Tola = <?= $tola_w ?>g · Labour = Rs. <?= number_format($labour_cost) ?>/Tola · Buy Cut = <?= $buy_cut ?></div>
        </div>
      </div>
    </div>
  </div>
  <?php endif; ?>


  <!-- ══════════════════════════════════════════════
       MODULE 2: GOLD & SILVER RATES UPDATE
  ═══════════════════════════════════════════════ -->
  <?php if ($tab === 'rates'): ?>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
    <div class="border-b border-slate-800 pb-4">
      <h2 class="font-serif text-xl font-bold text-amber-400">Update Today's Gold & Silver Rates</h2>
      <p class="text-xs text-slate-400 mt-1">Changes are published instantly across all website pages and the customer calculator.</p>
    </div>
    <form method="POST" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <input type="hidden" name="update_rates" value="1">
      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1.5">24K Gold (PKR / Tola)</label>
        <input type="number" step="10" name="gold_24k" value="<?= $current_rates['gold_24k'] ?>" required
               class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded text-amber-400 font-bold text-lg focus:border-amber-500 outline-none">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1.5">21K Gold (PKR / Tola)</label>
        <input type="number" step="10" name="gold_21k" value="<?= $current_rates['gold_21k'] ?>" required
               class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded text-amber-400 font-bold text-lg focus:border-amber-500 outline-none">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Normal Silver (PKR / Tola)</label>
        <input type="number" step="10" name="silver_normal" value="<?= $current_rates['silver_normal'] ?>" required
               class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded text-slate-200 font-bold text-lg focus:border-amber-500 outline-none">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Italian Silver (PKR / Tola)</label>
        <input type="number" step="10" name="silver_italian" value="<?= $current_rates['silver_italian'] ?>" required
               class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded text-slate-200 font-bold text-lg focus:border-amber-500 outline-none">
      </div>
      <div class="sm:col-span-2 lg:col-span-4">
        <button type="submit" class="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded transition-colors">
          Publish Rates Across Website
        </button>
      </div>
    </form>
  </div>
  <?php endif; ?>


  <!-- ══════════════════════════════════════════════
       MODULE 3: PRODUCT INVENTORY (Full CRUD)
  ═══════════════════════════════════════════════ -->
  <?php if ($tab === 'products'): ?>
  <div class="space-y-6">

    <!-- ADD PRODUCT -->
    <details class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden" <?= $edit_product ? '' : 'open' ?>>
      <summary class="px-6 py-4 font-serif font-bold text-amber-400 cursor-pointer select-none hover:bg-slate-800/50">
        ➕ Add New Product to Inventory
      </summary>
      <div class="px-6 pb-6 pt-2">
        <form method="POST" enctype="multipart/form-data" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="hidden" name="add_product" value="1">
          <div><label class="label-sm">Item Name *</label>
            <input type="text" name="name" required placeholder="e.g. 21K Bridal Choker" class="input-dark">
          </div>
          <div><label class="label-sm">Category *</label>
            <select name="category" class="input-dark">
              <option value="gold_bridal">Bridal Gold Sets</option>
              <option value="gold_bangles">Gold Bangles (Kara)</option>
              <option value="gold_chains">Gold Chains (Mala)</option>
              <option value="gold_rings">Gold Rings</option>
              <option value="earrings">Earrings & Jhumke</option>
              <option value="silver">Italian & Normal Silver</option>
            </select>
          </div>
          <div><label class="label-sm">Purity *</label>
            <select name="purity" class="input-dark">
              <option value="21K Gold">21K Gold</option>
              <option value="24K Gold">24K Gold</option>
              <option value="Italian Silver">Italian Silver</option>
              <option value="Normal Silver">Normal Silver</option>
            </select>
          </div>
          <div><label class="label-sm">Weight (Tola) *</label>
            <input type="number" step="0.001" name="weight_tola" required placeholder="1.5" class="input-dark">
          </div>
          <div><label class="label-sm">Price (PKR) *</label>
            <input type="number" name="price_pkr" required placeholder="432450" class="input-dark">
          </div>
          <div><label class="label-sm">Product Image</label>
            <input type="file" name="image" accept="image/*" class="input-dark text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-amber-500 file:text-slate-950 file:font-bold">
            <span class="text-[10px] text-slate-500">Or type filename below</span>
            <input type="text" name="image" placeholder="gold_bangles.png" class="input-dark mt-1">
          </div>
          <div class="sm:col-span-3"><label class="label-sm">Description *</label>
            <textarea name="description" required rows="2" placeholder="Item description..." class="input-dark resize-none"></textarea>
          </div>
          <div class="sm:col-span-3 flex items-center gap-4">
            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" name="is_featured" value="1" class="rounded"> Mark as Featured
            </label>
            <button type="submit" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase rounded transition-colors">Save Product</button>
          </div>
        </form>
      </div>
    </details>

    <!-- EDIT PRODUCT FORM (shown when ?edit_id= is set) -->
    <?php if ($edit_product): ?>
    <div class="bg-navy-900 border-2 border-amber-500/50 rounded-2xl p-6 space-y-4">
      <h3 class="font-serif font-bold text-amber-400">✏️ Editing: <?= htmlspecialchars($edit_product['name']) ?></h3>
      <form method="POST" enctype="multipart/form-data" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="hidden" name="edit_product" value="1">
        <input type="hidden" name="product_id" value="<?= $edit_product['id'] ?>">
        <div><label class="label-sm">Item Name *</label>
          <input type="text" name="name" required value="<?= htmlspecialchars($edit_product['name']) ?>" class="input-dark">
        </div>
        <div><label class="label-sm">Category *</label>
          <select name="category" class="input-dark">
            <?php foreach (['gold_bridal'=>'Bridal Gold Sets','gold_bangles'=>'Gold Bangles','gold_chains'=>'Gold Chains','gold_rings'=>'Gold Rings','earrings'=>'Earrings & Jhumke','silver'=>'Silver'] as $v=>$l): ?>
            <option value="<?= $v ?>" <?= $edit_product['category']===$v?'selected':'' ?>><?= $l ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div><label class="label-sm">Purity *</label>
          <select name="purity" class="input-dark">
            <?php foreach (['21K Gold','24K Gold','Italian Silver','Normal Silver'] as $p): ?>
            <option value="<?= $p ?>" <?= $edit_product['purity']===$p?'selected':'' ?>><?= $p ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div><label class="label-sm">Weight (Tola)</label>
          <input type="number" step="0.001" name="weight_tola" value="<?= $edit_product['weight_tola'] ?>" class="input-dark">
        </div>
        <div><label class="label-sm">Price (PKR)</label>
          <input type="number" name="price_pkr" value="<?= $edit_product['price_pkr'] ?>" class="input-dark">
        </div>
        <div><label class="label-sm">Image Filename</label>
          <input type="file" name="image" accept="image/*" class="input-dark text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-amber-500 file:text-slate-950 file:font-bold">
          <input type="text" name="image" value="<?= htmlspecialchars($edit_product['image']) ?>" class="input-dark mt-1">
        </div>
        <div class="sm:col-span-3"><label class="label-sm">Description</label>
          <textarea name="description" rows="2" class="input-dark resize-none"><?= htmlspecialchars($edit_product['description']) ?></textarea>
        </div>
        <div class="sm:col-span-3 flex flex-wrap items-center gap-4">
          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" name="is_featured" value="1" <?= $edit_product['is_featured']?'checked':'' ?> class="rounded"> Featured
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" name="is_available" value="1" <?= $edit_product['is_available']?'checked':'' ?> class="rounded"> Available
          </label>
          <button type="submit" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase rounded transition-colors">Update Product</button>
          <a href="?tab=products" class="px-4 py-2.5 bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded hover:bg-slate-600">Cancel</a>
        </div>
      </form>
    </div>
    <?php endif; ?>

    <!-- INVENTORY TABLE -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-800 flex flex-wrap gap-3 items-center justify-between">
        <h2 class="font-serif font-bold text-slate-100">Inventory (<?= count($products_list) ?>)</h2>
        <div class="flex gap-2 text-xs">
          <?php
          $cats = [''=>'All','gold_bridal'=>'Bridal','gold_bangles'=>'Bangles','gold_chains'=>'Chains','gold_rings'=>'Rings','earrings'=>'Earrings','silver'=>'Silver'];
          foreach ($cats as $v=>$l):
            $active = ($cat_filter===$v) ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700';
          ?>
          <a href="?tab=products&cat=<?= $v ?>" class="px-3 py-1.5 rounded font-bold uppercase tracking-wide transition-colors <?= $active ?>"><?= $l ?></a>
          <?php endforeach; ?>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950 text-slate-400 uppercase tracking-wider">
            <tr>
              <th class="p-3">Image</th>
              <th class="p-3">Item Name</th>
              <th class="p-3">Category</th>
              <th class="p-3">Purity</th>
              <th class="p-3">Weight</th>
              <th class="p-3">Price (PKR)</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <?php foreach ($products_list as $prod): ?>
            <tr class="hover:bg-slate-800/50 <?= $prod['is_available'] ? '' : 'opacity-50' ?>">
              <td class="p-3">
                <img src="<?= $base_url ?>/assets/images/<?= htmlspecialchars($prod['image']) ?>"
                     alt="" class="w-12 h-12 object-cover rounded-lg border border-slate-700"
                     onerror="this.src='<?= $base_url ?>/assets/images/logo.svg'; this.classList.add('p-2')">
              </td>
              <td class="p-3 font-bold text-slate-100 max-w-[180px]">
                <?= htmlspecialchars($prod['name']) ?>
                <?php if ($prod['is_featured']): ?><span class="ml-1 text-amber-400 text-[10px]">⭐ Featured</span><?php endif; ?>
              </td>
              <td class="p-3"><span class="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-semibold"><?= htmlspecialchars($prod['category']) ?></span></td>
              <td class="p-3 text-amber-400 font-semibold"><?= htmlspecialchars($prod['purity']) ?></td>
              <td class="p-3"><?= $prod['weight_tola'] ?> T</td>
              <td class="p-3 font-mono text-emerald-400 font-bold">Rs. <?= number_format($prod['price_pkr']) ?></td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $prod['is_available'] ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300' ?>">
                  <?= $prod['is_available'] ? 'Available' : 'Hidden' ?>
                </span>
              </td>
              <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <a href="?tab=products&edit_id=<?= $prod['id'] ?>" class="px-2 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 rounded text-[10px] font-bold">Edit</a>
                  <form method="POST" class="inline">
                    <input type="hidden" name="toggle_product" value="1">
                    <input type="hidden" name="product_id" value="<?= $prod['id'] ?>">
                    <input type="hidden" name="current_avail" value="<?= $prod['is_available'] ?>">
                    <button type="submit" class="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[10px] font-bold">
                      <?= $prod['is_available'] ? 'Hide' : 'Show' ?>
                    </button>
                  </form>
                  <form method="POST" class="inline" onsubmit="return confirm('Delete this product permanently?')">
                    <input type="hidden" name="delete_product" value="1">
                    <input type="hidden" name="product_id" value="<?= $prod['id'] ?>">
                    <button type="submit" class="px-2 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 rounded text-[10px] font-bold">Delete</button>
                  </form>
                </div>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <?php endif; ?>


  <!-- ══════════════════════════════════════════════
       MODULE 4: MESSAGES / ENQUIRIES
  ═══════════════════════════════════════════════ -->
  <?php if ($tab === 'enquiries'): ?>
  <div class="space-y-6">

    <!-- EDIT ENQUIRY FORM -->
    <?php if ($edit_enquiry): ?>
    <div class="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 space-y-4">
      <h3 class="font-serif font-bold text-amber-400">📩 Managing Message from <?= htmlspecialchars($edit_enquiry['name']) ?></h3>
      <div class="bg-slate-800 p-4 rounded text-sm text-slate-200 italic">
        "<?= htmlspecialchars($edit_enquiry['message']) ?>"
      </div>
      <form method="POST" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="hidden" name="update_enquiry" value="1">
        <input type="hidden" name="enquiry_id" value="<?= $edit_enquiry['id'] ?>">
        <div><label class="label-sm">Status</label>
          <select name="eq_status" class="input-dark">
            <?php foreach (['pending','completed','cancelled'] as $s): ?>
            <option value="<?= $s ?>" <?= ($edit_enquiry['status']??'')===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div><label class="label-sm">Urgency</label>
          <select name="eq_urgency" class="input-dark">
            <?php foreach (['low','normal','high'] as $u): ?>
            <option value="<?= $u ?>" <?= ($edit_enquiry['urgency']??'')===$u?'selected':'' ?>><?= ucfirst($u) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-2">
            <input type="checkbox" name="is_read" value="1" <?= ($edit_enquiry['is_read']??0)?'checked':'' ?> class="rounded"> Mark as Read
          </label>
        </div>
        <div class="sm:col-span-3"><label class="label-sm">Internal Note (Admin Only)</label>
          <textarea name="internal_note" rows="2" placeholder="Your private notes about this customer..." class="input-dark resize-none"><?= htmlspecialchars($edit_enquiry['internal_note'] ?? '') ?></textarea>
        </div>
        <div class="sm:col-span-3 flex gap-3">
          <button type="submit" class="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs uppercase rounded">Save Changes</button>
          <a href="?tab=enquiries" class="px-4 py-2.5 bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded hover:bg-slate-600">Cancel</a>
        </div>
      </form>
    </div>
    <?php endif; ?>

    <!-- FILTER BAR -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 flex flex-wrap gap-3 items-center">
      <span class="text-xs text-slate-400 font-bold uppercase">Filter:</span>
      <?php
      $statuses = [''=>'All','pending'=>'Pending','completed'=>'Completed','cancelled'=>'Cancelled'];
      foreach ($statuses as $v=>$l):
        $active = ($eq_filter===$v)?'bg-amber-500 text-slate-950':'bg-slate-800 text-slate-300 hover:bg-slate-700';
      ?>
      <a href="?tab=enquiries&eq_status=<?= $v ?>&eq_urgency=<?= $eq_urgency ?>" class="px-3 py-1 rounded text-xs font-bold uppercase transition-colors <?= $active ?>"><?= $l ?></a>
      <?php endforeach; ?>
      <span class="text-slate-600 mx-1">|</span>
      <?php
      $urgencies = [''=>'All Urgency','high'=>'🔴 High','normal'=>'🔵 Normal','low'=>'🟢 Low'];
      foreach ($urgencies as $v=>$l):
        $active = ($eq_urgency===$v)?'bg-amber-500 text-slate-950':'bg-slate-800 text-slate-300 hover:bg-slate-700';
      ?>
      <a href="?tab=enquiries&eq_urgency=<?= $v ?>&eq_status=<?= $eq_filter ?>" class="px-3 py-1 rounded text-xs font-bold transition-colors <?= $active ?>"><?= $l ?></a>
      <?php endforeach; ?>
    </div>

    <!-- ENQUIRIES LIST -->
    <div class="space-y-4">
      <?php if (empty($enquiries_list)): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-500">No messages found.</div>
      <?php else: foreach ($enquiries_list as $eq): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 <?= !($eq['is_read']??1) ? 'border-amber-500/30' : '' ?>">
        <div class="flex flex-wrap justify-between items-start gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold font-serif flex items-center justify-center">
              <?= strtoupper(substr($eq['name'], 0, 1)) ?>
            </div>
            <div>
              <div class="font-bold text-slate-100 flex items-center gap-2">
                <?= htmlspecialchars($eq['name']) ?>
                <?php if (!($eq['is_read']??1)): ?><span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span><?php endif; ?>
              </div>
              <div class="text-[11px] text-slate-400"><?= htmlspecialchars($eq['phone']) ?> · <?= date('d M Y H:i', strtotime($eq['created_at'])) ?></div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <?php $urg = $eq['urgency'] ?? 'normal'; ?>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold badge-<?= $urg ?>"><?= strtoupper($urg) ?></span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold badge-<?= $eq['status'] ?>"><?= strtoupper($eq['status']) ?></span>
            <span class="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] uppercase font-semibold"><?= str_replace('_',' ',$eq['service']) ?></span>
          </div>
        </div>
        <p class="text-sm text-slate-200 bg-slate-800 p-3 rounded"><?= htmlspecialchars($eq['message']) ?></p>
        <?php if (!empty($eq['internal_note'])): ?>
        <p class="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded">
          <strong>Note:</strong> <?= htmlspecialchars($eq['internal_note']) ?>
        </p>
        <?php endif; ?>
        <div class="flex flex-wrap gap-2 pt-1">
          <a href="?tab=enquiries&eq_edit=<?= $eq['id'] ?>" class="px-3 py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 rounded text-xs font-bold">Manage</a>
          <a href="https://wa.me/92<?= preg_replace('/[^0-9]/', '', substr($eq['phone'], 1)) ?>?text=Assalam%20o%20Alaikum%20<?= urlencode($eq['name']) ?>!%20Thank%20you%20for%20contacting%20Fahad%20Jewellery."
             target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold">WhatsApp Reply</a>
          <form method="POST" class="inline" onsubmit="return confirm('Delete this message?')">
            <input type="hidden" name="delete_enquiry" value="1">
            <input type="hidden" name="enquiry_id" value="<?= $eq['id'] ?>">
            <button type="submit" class="px-3 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 rounded text-xs font-bold">Delete</button>
          </form>
        </div>
      </div>
      <?php endforeach; endif; ?>
    </div>
  </div>
  <?php endif; ?>


  <!-- ══════════════════════════════════════════════
       MODULE 5: NOTES
  ═══════════════════════════════════════════════ -->
  <?php if ($tab === 'notes'): ?>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <h2 class="font-serif font-bold text-amber-400">Add Business Reminder / Customer Note</h2>
      <form method="POST" class="space-y-4">
        <input type="hidden" name="add_note" value="1">
        <div><label class="label-sm">Title *</label>
          <input type="text" name="title" required placeholder="e.g. Call Haji Rashid regarding 24K Kara order" class="input-dark">
        </div>
        <div><label class="label-sm">Details</label>
          <textarea name="note_text" rows="3" placeholder="Write supplier rates or special customer request details..." class="input-dark resize-none"></textarea>
        </div>
        <button type="submit" class="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs uppercase rounded">Save Note</button>
      </form>
    </div>
    <div class="space-y-3">
      <?php foreach ($notes_list as $n): ?>
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <h4 class="font-bold text-sm text-amber-400"><?= htmlspecialchars($n['title']) ?></h4>
        <p class="text-xs text-slate-300 mt-1"><?= htmlspecialchars($n['note_text']) ?></p>
        <span class="text-[10px] text-slate-500 mt-2 block"><?= date('d M Y H:i', strtotime($n['created_at'])) ?></span>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
  <?php endif; ?>


  <!-- ══════════════════════════════════════════════
       MODULE 6: FORMULA SETTINGS
  ═══════════════════════════════════════════════ -->
  <?php if ($tab === 'settings'): ?>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div class="border-b border-slate-800 pb-4">
        <h2 class="font-serif text-xl font-bold text-amber-400">Formula Configuration & Store Settings</h2>
        <p class="text-xs text-slate-400 mt-1">These values drive the Gold Calculator and all internal business calculations.</p>
      </div>
      <form method="POST" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <input type="hidden" name="update_settings" value="1">

        <div>
          <label class="label-sm">Tola Weight in Grams</label>
          <input type="number" step="0.001" name="tola_weight_grams" value="<?= $tola_w ?>" required class="input-dark text-amber-400 font-bold text-lg">
          <p class="text-[10px] text-slate-500 mt-1">Standard: 12g · International: 11.6638g</p>
        </div>

        <div>
          <label class="label-sm">Labour Cost (PKR / Tola)</label>
          <input type="number" step="100" name="labour_cost_pkr" value="<?= $labour_cost ?>" required class="input-dark text-amber-400 font-bold text-lg">
          <p class="text-[10px] text-slate-500 mt-1">Customer-facing calculator default</p>
        </div>

        <div>
          <label class="label-sm">Selling Divisor (Default 12)</label>
          <input type="number" step="0.001" name="sell_divisor" value="<?= $sell_div ?>" required class="input-dark text-amber-400 font-bold text-lg">
          <p class="text-[10px] text-slate-500 mt-1">Selling Price = (Rate / divisor) × grams</p>
        </div>

        <div>
          <label class="label-sm">Buying Divisor (Default 12.150)</label>
          <input type="number" step="0.001" name="buy_divisor" value="<?= $buy_div ?>" required class="input-dark text-amber-400 font-bold text-lg">
          <p class="text-[10px] text-slate-500 mt-1">Buy Price = (Rate / buy_divisor) × (cut/12) × grams</p>
        </div>

        <div>
          <label class="label-sm">Default Buy Cut Value (e.g. 9.5)</label>
          <input type="number" step="0.1" name="buy_cut_default" value="<?= $buy_cut ?>" required class="input-dark text-amber-400 font-bold text-lg">
          <p class="text-[10px] text-slate-500 mt-1">Used in admin calculator for buying old gold</p>
        </div>

        <div>
          <label class="label-sm">Store Hours Display</label>
          <input type="text" name="store_hours" value="<?= htmlspecialchars($store_hours) ?>" required class="input-dark">
        </div>

        <div class="sm:col-span-2 lg:col-span-3">
          <button type="submit" class="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded transition-colors">
            Save Formula Settings
          </button>
        </div>
      </form>
    </div>

    <!-- Formula Reference Card -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
      <h3 class="font-bold text-slate-100 text-sm">Formula Reference</h3>
      <div class="font-mono text-xs text-slate-300 space-y-2">
        <div class="bg-slate-800 p-3 rounded">
          <span class="text-amber-400">Customer Selling Price:</span><br>
          Price = (Today Rate / <?= $sell_div ?>) × Weight(grams) + Labour (Rs. <?= number_format($labour_cost) ?>/Tola × weight_tola)
        </div>
        <div class="bg-slate-800 p-3 rounded">
          <span class="text-rose-400">Admin Gold Buying Price:</span><br>
          Price = (Today Rate / <?= $buy_div ?>) × (Cut / 12) × Weight(grams)
        </div>
      </div>
    </div>
  </div>
  <?php endif; ?>


  <!-- ══════════════════════════════════════════════
       MODULE 7: ADMIN GOLD CALCULATOR (Staff Only)
  ═══════════════════════════════════════════════ -->
  <?php if ($tab === 'calculator'): ?>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-6">
      <div class="border-b border-slate-800 pb-4">
        <h2 class="font-serif text-xl font-bold text-amber-400">🧮 Admin Gold Calculator</h2>
        <p class="text-xs text-slate-400 mt-1">Internal staff calculator. Includes both selling and buying (old gold) modes. Not visible to customers.</p>
      </div>

      <!-- Mode Tabs -->
      <div class="flex gap-3">
        <button id="adm-sell" onclick="setMode('sell')"
                class="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs uppercase rounded">
          Selling to Customer
        </button>
        <button id="adm-buy" onclick="setMode('buy')"
                class="px-5 py-2.5 bg-slate-700 text-slate-200 font-bold text-xs uppercase rounded hover:bg-slate-600">
          Buying from Customer (Purana Sona)
        </button>
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label class="label-sm">Purity / Metal</label>
          <select id="adm-purity" class="input-dark">
            <option value="<?= $current_rates['gold_24k'] ?>">24K Pure Gold — Rs. <?= number_format($current_rates['gold_24k']) ?></option>
            <option value="<?= $current_rates['gold_21k'] ?>" selected>21K Gold — Rs. <?= number_format($current_rates['gold_21k']) ?></option>
            <option value="<?= $current_rates['silver_normal'] ?>">Normal Silver — Rs. <?= number_format($current_rates['silver_normal']) ?></option>
            <option value="<?= $current_rates['silver_italian'] ?>">Italian Silver — Rs. <?= number_format($current_rates['silver_italian']) ?></option>
          </select>
        </div>
        <div>
          <label class="label-sm">Weight</label>
          <div class="flex gap-2">
            <input type="number" id="adm-weight" placeholder="e.g. 2.5" step="0.001" min="0" class="input-dark flex-1">
            <select id="adm-unit" class="input-dark w-24">
              <option value="tola">Tola</option>
              <option value="gram">Grams</option>
            </select>
          </div>
        </div>
        <div id="adm-cut-wrap" class="hidden">
          <label class="label-sm">Cut Value (Default <?= $buy_cut ?>)</label>
          <input type="number" id="adm-cut" value="<?= $buy_cut ?>" step="0.1" min="1" max="12" class="input-dark text-rose-400 font-bold">
        </div>
        <div id="adm-labour-wrap">
          <label class="label-sm">Labour Charges (PKR / Tola)</label>
          <input type="number" id="adm-labour" value="<?= $labour_cost ?>" step="100" class="input-dark">
        </div>
      </div>

      <!-- Result -->
      <div class="bg-slate-950 p-6 rounded-xl border border-amber-500/20 text-center space-y-3">
        <span id="adm-label" class="text-[11px] uppercase tracking-widest text-amber-400 font-bold">Estimated Selling Price (PKR)</span>
        <div id="adm-result" class="font-serif text-5xl font-bold text-amber-400">Rs. 0</div>
        <div class="text-xs text-slate-400 grid grid-cols-2 max-w-xs mx-auto gap-x-6 text-left">
          <span>Gold Value:</span><span id="adm-gold-val" class="text-right font-semibold text-slate-200">Rs. 0</span>
          <span id="adm-extra-label">Labour Total:</span><span id="adm-extra-val" class="text-right font-semibold text-slate-200">Rs. 0</span>
        </div>
      </div>

    </div>
  </div>

  <script>
  const ADM = {
    mode      : 'sell',
    TOLA_G    : <?= floatval($tola_w) ?>,
    SELL_DIV  : <?= floatval($sell_div) ?>,
    BUY_DIV   : <?= floatval($buy_div) ?>,
    DEF_LABOUR: <?= floatval($labour_cost) ?>,
    purity    : document.getElementById('adm-purity'),
    weight    : document.getElementById('adm-weight'),
    unit      : document.getElementById('adm-unit'),
    cut       : document.getElementById('adm-cut'),
    cutWrap   : document.getElementById('adm-cut-wrap'),
    labour    : document.getElementById('adm-labour'),
    labourWrap: document.getElementById('adm-labour-wrap'),
    result    : document.getElementById('adm-result'),
    label     : document.getElementById('adm-label'),
    goldVal   : document.getElementById('adm-gold-val'),
    extraLabel: document.getElementById('adm-extra-label'),
    extraVal  : document.getElementById('adm-extra-val'),
    btnSell   : document.getElementById('adm-sell'),
    btnBuy    : document.getElementById('adm-buy'),
  };

  function setMode(mode) {
    ADM.mode = mode;
    if (mode === 'sell') {
      ADM.btnSell.className = 'px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs uppercase rounded';
      ADM.btnBuy.className  = 'px-5 py-2.5 bg-slate-700 text-slate-200 font-bold text-xs uppercase rounded hover:bg-slate-600';
      ADM.cutWrap.classList.add('hidden');
      ADM.labourWrap.classList.remove('hidden');
      ADM.label.textContent = 'Estimated Selling Price (PKR)';
      ADM.extraLabel.textContent = 'Labour Total:';
    } else {
      ADM.btnBuy.className  = 'px-5 py-2.5 bg-rose-600 text-white font-bold text-xs uppercase rounded';
      ADM.btnSell.className = 'px-5 py-2.5 bg-slate-700 text-slate-200 font-bold text-xs uppercase rounded hover:bg-slate-600';
      ADM.cutWrap.classList.remove('hidden');
      ADM.labourWrap.classList.add('hidden');
      ADM.label.textContent = 'Cash Payout for Buying Gold (PKR)';
      ADM.extraLabel.textContent = 'After Cut Deduction:';
    }
    calc();
  }

  function calc() {
    const rate   = parseFloat(ADM.purity.value) || 0;
    const raw    = parseFloat(ADM.weight.value) || 0;
    const unit   = ADM.unit.value;
    const wTola  = unit === 'gram' ? raw / ADM.TOLA_G : raw;
    const wGram  = wTola * ADM.TOLA_G;
    const labour = parseFloat(ADM.labour.value) || 0;
    const cut    = parseFloat(ADM.cut.value) || 9.5;

    let goldVal = 0, extra = 0, total = 0;
    if (ADM.mode === 'sell') {
      goldVal = (rate / ADM.SELL_DIV) * wGram;
      extra   = labour * wTola;
      total   = goldVal + extra;
    } else {
      goldVal = (rate / ADM.BUY_DIV) * (cut / 12) * wGram;
      extra   = goldVal; // same as total for buying
      total   = goldVal;
    }

    const fmt = n => 'Rs. ' + Math.round(n).toLocaleString('en-PK');
    ADM.result.textContent  = fmt(total);
    ADM.goldVal.textContent = fmt(goldVal);
    ADM.extraVal.textContent = ADM.mode === 'sell' ? fmt(extra) : '';
  }

  [ADM.purity, ADM.weight, ADM.unit, ADM.cut, ADM.labour].forEach(el => {
    if(el) el.addEventListener('input', calc);
  });
  calc();
  </script>
  <?php endif; ?>

</div><!-- /max-w-7xl -->

<style>
  .label-sm { @apply block text-xs font-semibold text-slate-300 uppercase mb-1.5; }
  .input-dark { @apply w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded text-sm text-slate-100 focus:border-amber-500 outline-none; }
</style>

</body>
</html>
