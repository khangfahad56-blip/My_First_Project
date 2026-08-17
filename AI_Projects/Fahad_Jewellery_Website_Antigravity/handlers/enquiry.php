<?php
// handlers/enquiry.php – AJAX enquiry form handler
header('Content-Type: application/json');
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$name    = trim(htmlspecialchars($_POST['name']    ?? ''));
$phone   = trim(htmlspecialchars($_POST['phone']   ?? ''));
$email   = trim(htmlspecialchars($_POST['email']   ?? ''));
$service = trim(htmlspecialchars($_POST['service'] ?? 'general'));
$message = trim(htmlspecialchars($_POST['message'] ?? ''));

if (empty($name) || empty($phone) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

if (!preg_match('/^03[0-9]{9}$/', preg_replace('/[-\s]/', '', $phone))) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid Pakistani mobile number']);
    exit;
}

$valid_services = ['gold_buying','gold_selling','repair','polishing','custom_order','general'];
if (!in_array($service, $valid_services)) $service = 'general';

if ($conn) {
    $stmt = $conn->prepare("INSERT INTO enquiries (name, phone, email, service, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssss', $name, $phone, $email, $service, $message);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Enquiry saved']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
    $stmt->close();
} else {
    // DB unavailable – still respond positively so user isn't blocked
    echo json_encode(['success' => true, 'message' => 'Enquiry received (db offline)']);
}
$conn && $conn->close();
