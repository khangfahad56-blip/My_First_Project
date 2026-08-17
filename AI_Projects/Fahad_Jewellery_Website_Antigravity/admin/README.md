# 👨‍💼 Admin Panel

Secure administrative interface for managing the Fahad Jewellery platform.

## 📁 Files

### `login.php`
Admin authentication and session management.

**Features:**
- Secure login form with validation
- Password verification using PHP's `password_verify()`
- Session-based authentication
- Auto-redirect to dashboard if already logged in
- Error handling with user feedback

**Usage:**
1. Access `http://localhost/fahad_jewellery/admin/login.php`
2. Enter admin credentials
3. Redirects to dashboard on success

---

### `dashboard.php`
Main admin control panel for managing store operations.

**Capabilities:**
- 📊 View sales analytics & statistics
- 📦 Product management (add, edit, delete)
- 📋 Order management
- 💬 Customer inquiry tracking
- 👥 Admin user management
- ⚙️ Store configuration
- 🚪 Logout function

---

## 🔐 Authentication Flow

```
User visits login.php
         ↓
  [Already logged in?]
         ├─ Yes → Redirect to dashboard.php
         └─ No  → Show login form
              ↓
         Form submitted?
              ├─ No → Display form
              └─ Yes → Validate credentials
                   ↓
              [Credentials valid?]
                   ├─ Yes → Create session → Redirect to dashboard
                   └─ No  → Show error message
```

---

## 📝 Login Credentials

### Default Admin Account
- **Username:** admin
- **Password:** (set during initial setup)

> ⚠️ **CRITICAL**: Change default password immediately after first login!

### Create Additional Admin Accounts

In database:
```sql
INSERT INTO admins (username, password_hash, email, created_at) 
VALUES ('newadmin', password_hash('secure_password', PASSWORD_BCRYPT), 'admin@example.com', NOW());
```

---

## 🔒 Session Management

Sessions are stored server-side:

```php
$_SESSION['admin_logged_in']  = true;
$_SESSION['admin_username']   = 'admin';
```

**Session Security:**
- ✅ Server-side storage (not in cookies)
- ✅ Automatic timeout after inactivity
- ✅ HTTPS recommended (prevents session hijacking)

**Logout (destroy session):**
```php
session_destroy();
header('Location: login.php');
```

---

## 📊 Dashboard Features

### Product Management
- ✏️ Create new products
- 📝 Edit existing products
- 🗑️ Delete products
- 📤 Upload product images
- 🏷️ Manage categories & tags
- 📦 Track inventory levels

### Order Management
- 📋 View all customer orders
- 🔍 Search & filter orders
- ✅ Mark orders as fulfilled
- 🚚 Track shipping status
- 📧 Send order updates

### Inquiry Management
- 💬 View customer inquiries
- ✅ Mark as resolved
- 📧 Send responses
- 📊 Inquiry statistics

### Analytics
- 📈 Sales trends
- 👥 Customer insights
- 💰 Revenue tracking
- 🔥 Best-selling products

---

## 🚀 Accessing Admin Panel

### Direct Access
```
http://localhost/fahad_jewellery/admin/login.php
```

### Protected Access
All admin pages check for active session:

```php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}
```

---

## 🔧 Configuration

### Base URL
Set in `login.php`:
```php
$base_url = '/fahad_jewellery';  // Adjust to your deployment path
```

### Database Connection
Connects via:
```php
require_once '../config/db.php';
```

---

## 🛡️ Security Best Practices

✅ **Implemented:**
- Password hashing (password_hash / password_verify)
- Session validation
- SQL prepared statements
- Error logging (doesn't expose errors to users)

⚠️ **To Implement:**
- Add CSRF token to all forms
- Implement rate limiting on login
- Add IP whitelisting option
- Enable two-factor authentication (2FA)
- Add activity logging (who changed what, when)
- Implement session timeout warnings

### Recommended Settings

Add to `.htaccess` to protect admin folder:

```apache
<FilesMatch "\.php$">
    Order Deny,Allow
    Deny from all
    Allow from 127.0.0.1
</FilesMatch>
```

---

## 🧪 Testing Login

### Test Credentials
```
Username: admin
Password: (your chosen password)
```

### Verify Session
After login, check:
```
$_SESSION['admin_logged_in']  // Should be true
$_SESSION['admin_username']   // Should be 'admin'
```

---

## 🆘 Troubleshooting

### Login Not Working
**Problem:** "Invalid credentials" error
**Solution:** 
- Verify username exists in `admins` table
- Check password hash is correct
- Try resetting password manually in database

### Session Lost
**Problem:** Logged out unexpectedly
**Solution:**
- Check session timeout settings
- Verify session.gc_maxlifetime in php.ini
- Clear browser cookies

### Dashboard Won't Load
**Problem:** "Access denied" or blank page
**Solution:**
- Verify session is active: `print_r($_SESSION);`
- Check database connection: `if (!$conn) exit('DB Error');`
- Review error logs in php.ini error_log location

---

## 📋 Admin Workflow

### Daily Operations
1. ✅ Login to dashboard
2. 📋 Review new orders
3. 💬 Check customer inquiries
4. 📊 View sales metrics
5. ⚙️ Update product inventory
6. 🚪 Logout when done

### Weekly Tasks
- 📈 Review sales analytics
- 📦 Update product catalog
- 👥 Manage user accounts
- 💾 Backup database

---

## 📞 Support

For issues with admin panel:
1. Check error logs in server
2. Verify database connectivity
3. Review session configuration
4. Check firewall/security settings

---

**Last Updated:** 2026-08-16  
**Version:** 2.0
