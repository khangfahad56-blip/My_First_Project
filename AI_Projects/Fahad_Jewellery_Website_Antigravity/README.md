# 💎 Fahad Jewellery

> A premium, full-featured jewelry e-commerce platform with admin dashboard, live gold rate tracking, and responsive design built with PHP & MySQL

[![PHP](https://img.shields.io/badge/PHP-7.4%2B-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-00758F?style=flat-square&logo=mysql)](https://www.mysql.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5)](https://html.spec.whatwg.org)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3)](https://www.w3.org/Style/CSS)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20First-4CAF50?style=flat-square)](https://en.wikipedia.org/wiki/Responsive_web_design)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [Admin Panel](#-admin-panel)
- [API Endpoints](#-api-endpoints)
- [Configuration](#-configuration)
- [File Structure](#-file-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Fahad Jewellery** is a comprehensive e-commerce platform specializing in premium jewelry, serving customers in Nowshera, KPK since 2010. The platform features:

- 🏪 **Professional storefront** with product catalog
- 💰 **Live gold rate tracking** via real-time API integration
- 📱 **Fully responsive design** (mobile, tablet, desktop)
- 👨‍💼 **Secure admin dashboard** for inventory management
- 💬 **Customer inquiry system** with email notifications
- ✨ **Modern UI/UX** with luxury aesthetic

---

## ✨ Features

### 🛍️ Customer Portal

- **Homepage** – Hero section, featured products, testimonials, live gold rates
- **Collections** – Browse jewelry by category (24K Gold, 21K Gold, Silver)
- **Product Details** – High-quality images, descriptions, pricing
- **Gold Rate Tracker** – Real-time daily/weekly gold price updates
- **Services** – Gold buying & repair information
- **Contact Page** – Customer inquiry form with validation
- **Responsive Design** – Optimized for all devices
- **SEO Optimized** – Meta tags, structured data, fast load times

### 👨‍💼 Admin Dashboard

- **Secure Login** – Session-based authentication
- **Product Management** – Add, edit, delete products
- **Inventory Control** – Track stock levels
- **Order Management** – View & manage customer orders
- **Inquiry Management** – Track customer inquiries
- **User Administration** – Manage admin accounts
- **Analytics** – View sales data and customer insights
- **Settings** – Configure business details

### 🤖 Backend Features

- **Gold Rate API** – Automatic price updates
- **Email Notifications** – Send inquiry confirmations
- **Form Validation** – Client-side & server-side
- **Session Management** – Secure user authentication
- **Database Transactions** – Data integrity & consistency

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Backend Language** | PHP 7.4+ |
| **Database** | MySQL 8.0 |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Server** | Apache/Nginx |
| **Version Control** | Git |

### Additional Libraries & Tools
- **Password Hashing** – PHP's `password_hash()` & `password_verify()`
- **Session Management** – PHP Sessions
- **Database Abstraction** – MySQLi (Object-Oriented)
- **API Integration** – Gold rate data providers

---

## 📁 Project Structure

```
fahad_jewellery/
├── 📄 index.php                    # Homepage
├── 📄 about.php                    # About Us
├── 📄 collections.php              # Product Collections
├── 📄 contact.php                  # Contact Form
├── 📄 services.php                 # Services Info
├── 📄 gold-rates.php               # Gold Rate Tracker
├── 📄 migrate.php                  # Database Migration Tool
│
├── 📁 config/                      # Configuration & Database
│   ├── db.php                      # Database connection
│   └── schema.sql                  # Database schema
│
├── 📁 admin/                       # Admin Panel
│   ├── login.php                   # Admin login page
│   └── dashboard.php               # Admin dashboard
│
├── 📁 handlers/                    # API & Form Handlers
│   ├── enquiry.php                 # Contact form handler
│   └── gold_rate_api.php           # Gold rate API integration
│
├── 📁 includes/                    # Reusable Components
│   ├── header.php                  # Header template
│   ├── footer.php                  # Footer template
│   └── ... (other includes)
│
├── 📁 assets/                      # Static Assets
│   ├── css/                        # Stylesheets
│   ├── js/                         # JavaScript files
│   ├── images/                     # Product & site images
│   └── fonts/                      # Custom fonts
│
└── 📁 .git/                        # Git version control
```

---

## 🚀 Getting Started

### Prerequisites

- **PHP 7.4** or higher
- **MySQL 8.0** or higher
- **Apache** or **Nginx** web server
- **Git** for version control
- **Composer** (optional, for dependency management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fahad-jewellery.git
   cd fahad_jewellery
   ```

2. **Set up the database**
   ```bash
   mysql -u root -p
   CREATE DATABASE fahad_jewellery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE fahad_jewellery_db;
   SOURCE config/schema.sql;
   ```

3. **Configure database connection**
   - Edit `config/db.php`
   - Update `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` as needed

4. **Set up web server**
   - For Apache: Point document root to project folder
   - For Nginx: Configure `server` block to point to project folder

5. **Create admin account**
   - Access `migrate.php` to seed initial data
   - Or manually insert into `admins` table

6. **Open in browser**
   ```
   http://localhost/fahad_jewellery
   ```

---

## 📊 Database Setup

### Running Migrations

The `migrate.php` file handles database schema creation:

```bash
# Visit in browser to run migrations
http://localhost/fahad_jewellery/migrate.php
```

### Database Tables

The system includes the following tables:

- **products** – Product catalog (name, price, category, images)
- **admins** – Admin user accounts (username, password_hash)
- **orders** – Customer orders (order_date, items, total)
- **enquiries** – Customer inquiries (name, email, message)
- **gold_rates** – Historical gold price data
- **testimonials** – Customer reviews & testimonials
- **categories** – Product categories (24K, 21K, Silver)

See `config/schema.sql` for complete schema.

---

## 👨‍💼 Admin Panel

### Accessing the Admin Panel

```
http://localhost/fahad_jewellery/admin/login.php
```

### Default Admin Credentials
- **Username:** admin
- **Password:** (set during migration or manually in database)

> ⚠️ **Security**: Change default password immediately after first login!

### Admin Capabilities

- ✏️ Create, read, update, delete products
- 📦 Manage inventory & stock levels
- 📋 View & manage customer orders
- 💬 Track customer inquiries
- 👥 Create additional admin accounts
- ⚙️ Configure business settings
- 📊 View basic analytics

---

## 🔌 API Endpoints

### Gold Rate API

```php
// Get latest gold rates
$rates = get_latest_gold_rates($conn);

// Returns array with daily/weekly rates for 24K, 22K, 21K, 18K gold
```

### Contact Form Handler

```
POST /handlers/enquiry.php
Content-Type: application/x-www-form-urlencoded

name=John&email=john@example.com&message=Inquiry text...
```

---

## ⚙️ Configuration

### Database Configuration

Edit `config/db.php`:

```php
define('DB_HOST', 'localhost');   // Database host
define('DB_USER', 'root');        // Database user
define('DB_PASS', '');            // Database password
define('DB_NAME', 'fahad_jewellery_db');  // Database name
```

### Base URL Configuration

Set `$base_url` in main files:

```php
$base_url = '/fahad_jewellery';   // Adjust to your deployment path
```

### Email Configuration

For notifications, configure in `handlers/enquiry.php`:

```php
$to = 'admin@fahad-jewellery.com';
$subject = 'New Customer Inquiry';
```

---

## 📁 File Structure Details

### `/config`
Database connection & schema files
- `db.php` – MySQLi connection object
- `schema.sql` – Database tables & initial data

### `/admin`
Admin panel pages (protected by session authentication)
- `login.php` – Admin authentication form
- `dashboard.php` – Main admin dashboard & management interface

### `/handlers`
Backend processing & API endpoints
- `enquiry.php` – Contact form processing & email
- `gold_rate_api.php` – Gold price data fetching

### `/includes`
Reusable template components
- `header.php` – Common header markup
- `footer.php` – Common footer markup

### `/assets`
Static resources (CSS, JS, images, fonts)
- `css/` – Stylesheets
- `js/` – JavaScript files
- `images/` – Product photos & logos
- `fonts/` – Custom web fonts

---

## 🔒 Security Best Practices

✅ **Implemented:**
- Password hashing with `password_hash()`
- Prepared statements to prevent SQL injection
- Session-based authentication
- CSRF token validation (implement in forms)

⚠️ **To Implement:**
- Add CSRF tokens to all forms
- Enable HTTPS only
- Implement rate limiting
- Validate & sanitize all user inputs
- Use environment variables for sensitive data

---

## 🐛 Troubleshooting

### Database Connection Error
```
DB Connection failed: ...
```
**Solution:** Check `config/db.php` credentials and ensure MySQL is running

### Admin Login Not Working
**Solution:** Verify admin account exists in `admins` table and password hash is correct

### Gold Rates Not Updating
**Solution:** Check API endpoint in `handlers/gold_rate_api.php` and internet connection

### Images Not Loading
**Solution:** Verify image paths in database and check `/assets/images/` folder exists

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

### Code Standards
- Follow PSR-12 PHP coding standards
- Use meaningful variable/function names
- Add comments for complex logic
- Test all changes before submitting PR

---

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 📞 Support & Contact

**Fahad Jewellery**
- 📍 Location: Nowshera, KPK
- 📧 Email: info@fahad-jewellery.com
- 🌐 Website: fahad-jewellery.com
- 👨‍💼 Owner: Gul Nawaz Khan (since 2010)

---

## 📚 Additional Resources

- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Web Development Best Practices](https://web.dev)
- [Security Guide for PHP Developers](https://www.php.net/manual/en/security.php)

---

**Last Updated:** 2026-08-16  
**Version:** 2.0  
**Maintainer:** Development Team
