<?php
// config/db.php – MySQL Database Connection
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'fahad_jewellery_db');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    error_log("DB Connection failed: " . $conn->connect_error);
    // Graceful fallback – don't expose error to public
    $conn = null;
}

if ($conn) {
    $conn->set_charset("utf8mb4");
}
?>
