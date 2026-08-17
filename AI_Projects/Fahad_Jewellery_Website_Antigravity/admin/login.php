<?php
// admin/login.php – Admin Login Page
session_start();
require_once '../config/db.php';
$base_url = '/fahad_jewellery';

$error = '';

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!empty($username) && !empty($password)) {
        if ($conn) {
            $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ?");
            $stmt->bind_param('s', $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result && $result->num_rows === 1) {
                $admin = $result->fetch_assoc();
                if (password_verify($password, $admin['password_hash'])) {
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_username']  = $admin['username'];
                    header('Location: dashboard.php');
                    exit;
                }
            }
        }
        // Fallback demo login if password verification failed or DB offline
        if ($username === 'fahad' && $password === 'Jewellery@2010') {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_username']  = 'fahad';
            header('Location: dashboard.php');
            exit;
        }
        $error = 'Invalid username or password';
    } else {
        $error = 'Please fill in both fields';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login – Fahad Jewellery</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 font-sans min-h-screen flex items-center justify-center p-4">

  <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6">
    <div class="text-center space-y-2">
      <div class="w-12 h-12 bg-amber-500 rounded-full text-slate-900 font-serif font-bold text-xl flex items-center justify-center mx-auto">F</div>
      <h1 class="font-serif text-2xl font-bold text-slate-100">Fahad Jewellery Admin</h1>
      <p class="text-xs text-slate-400">Sign in to manage gold rates & customer enquiries</p>
    </div>

    <?php if ($error): ?>
    <div class="bg-rose-500/20 border border-rose-500 text-rose-200 text-xs p-3 rounded text-center">
      <?= htmlspecialchars($error) ?>
    </div>
    <?php endif; ?>

    <form method="POST" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Username</label>
        <input type="text" name="username" required value="fahad" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:border-amber-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
        <input type="password" name="password" required placeholder="••••••••" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:border-amber-500">
      </div>
      <button type="submit" class="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs uppercase tracking-widest rounded transition-colors">
        Sign In to Dashboard
      </button>
    </form>

    <div class="text-center pt-2">
      <a href="<?= $base_url ?>/index.php" class="text-xs text-slate-400 hover:text-amber-400">← Back to Website</a>
    </div>
  </div>

</body>
</html>
