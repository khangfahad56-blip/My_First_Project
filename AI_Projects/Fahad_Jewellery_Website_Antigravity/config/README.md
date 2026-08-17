# ⚙️ Configuration Directory

Configuration files for database connection and schema management.

## 📁 Files

### `db.php`
Database connection configuration and connection object initialization.

**Purpose:** Establishes connection to MySQL database with error handling

**Constants Defined:**
```php
DB_HOST    // Database server hostname
DB_USER    // Database user
DB_PASS    // Database password
DB_NAME    // Database name
```

**Provides:**
```php
$conn      // MySQLi connection object (global)
```

**Example Usage:**
```php
require_once 'config/db.php';
$result = $conn->query("SELECT * FROM products");
```

---

### `schema.sql`
Complete database schema with tables, relationships, and initial seed data.

**Tables:**
- `products` – Product catalog
- `admins` – Admin user accounts
- `orders` – Customer orders
- `enquiries` – Contact form submissions
- `gold_rates` – Historical gold rates
- `testimonials` – Customer reviews
- `categories` – Product categories

**Import the schema:**
```bash
mysql -u root -p fahad_jewellery_db < config/schema.sql
```

---

## 🔧 Configuration Steps

### 1. Update Database Credentials

Edit `db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'fahad_jewellery_db');
```

### 2. Create Database

```bash
mysql -u root -p
CREATE DATABASE fahad_jewellery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Import Schema

```bash
mysql -u root -p fahad_jewellery_db < config/schema.sql
```

### 4. Verify Connection

Visit `http://localhost/fahad_jewellery/migrate.php` to test connection and run migrations.

---

## 🚨 Important Notes

⚠️ **Never commit credentials to version control!**

Use environment variables or `.env` files:

```php
// Better approach using .env
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
```

---

## 📝 Database Connection Handling

The connection object handles:
- ✅ UTF-8 charset (utf8mb4)
- ✅ Error logging (doesn't expose errors publicly)
- ✅ Null fallback if connection fails
- ✅ Error checking before queries

**Connection Flow:**
```
Attempt Connection
         ↓
    [Success?]
         ├─ Yes → Set charset → Return $conn
         └─ No  → Log error → Return null
```

---

## 🔐 Security Considerations

✅ **Implemented:**
- Charset specification (prevents encoding attacks)
- Error logging (doesn't expose database structure)
- Connection object validation

⚠️ **To Add:**
- SSL/TLS connection option
- Connection pooling
- Read replicas for scaling
- Environment-based configuration

---

## 📊 Charset & Encoding

The connection uses **utf8mb4** for full UTF-8 support:

```php
$conn->set_charset("utf8mb4");
```

This enables:
- Emoji storage ✨
- Special characters (Arabic, Chinese, etc.)
- Proper text handling globally

---

## 🧪 Testing Connection

Create a test file to verify setup:

```php
<?php
require_once 'config/db.php';

if ($conn) {
    echo "✅ Connection successful!";
    $result = $conn->query("SELECT VERSION()");
    $row = $result->fetch_assoc();
    echo "MySQL Version: " . $row['VERSION()'];
} else {
    echo "❌ Connection failed!";
}
?>
```

---

**Last Updated:** 2026-08-16
