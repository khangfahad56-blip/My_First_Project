<?php
// migrate.php – Run once to apply Phase 3 DB schema changes. Delete after use.
require_once 'config/db.php';

$queries = [
    // Add enquiries columns (safe, ignore if already exist)
    "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS is_read TINYINT(1) DEFAULT 0 AFTER status",
    "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS internal_note TEXT AFTER is_read",
    "ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS urgency ENUM('low','normal','high') DEFAULT 'normal' AFTER internal_note",

    // Add new settings
    "INSERT INTO settings (setting_key, setting_value) VALUES ('tola_weight_grams', '12') ON DUPLICATE KEY UPDATE setting_value='12'",
    "INSERT INTO settings (setting_key, setting_value) VALUES ('labour_cost_pkr', '2000') ON DUPLICATE KEY UPDATE setting_value='2000'",

    // Update product images to new filenames
    "UPDATE products SET image='bridal_set.png' WHERE category='gold_bridal'",
    "UPDATE products SET image='gold_bangles.png' WHERE category='gold_bangles'",
    "UPDATE products SET image='gold_chain.png' WHERE category='gold_chains'",
    "UPDATE products SET image='gold_ring.png' WHERE category='gold_rings'",
    "UPDATE products SET image='gold_earrings.png' WHERE category='earrings'",
    "UPDATE products SET image='silver_bracelet.png' WHERE category='silver'",
];

echo "<pre style='font-family:monospace;background:#111;color:#0f0;padding:20px;'>";
echo "=== Fahad Jewellery Phase 3 Migration ===\n\n";

foreach ($queries as $sql) {
    if ($conn->query($sql)) {
        echo "✅ OK: " . substr($sql, 0, 70) . "...\n";
    } else {
        echo "⚠️  WARN: " . $conn->error . " → " . substr($sql, 0, 70) . "\n";
    }
}

echo "\n=== Migration Complete! ===\n";
echo "Delete migrate.php from your server after confirming the changes.\n";
echo "</pre>";
$conn->close();
?>
