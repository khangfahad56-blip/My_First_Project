# 🔌 Handlers Directory

Backend API endpoints and form processing handlers for the Fahad Jewellery platform.

## 📁 Files

### `enquiry.php`
Processes customer inquiries from contact forms.

**Functionality:**
- ✅ Validates form input (name, email, message)
- 📧 Sends confirmation emails
- 💾 Stores inquiry in database
- 🔄 Redirects with success/error message

**Form Input:**
```
POST /handlers/enquiry.php

name     (string)    - Customer name
email    (string)    - Customer email
message  (string)    - Inquiry message
phone    (string)    - Optional contact number
subject  (string)    - Optional inquiry subject
```

**Processing Flow:**
```
Form submitted
      ↓
Validate inputs
      ↓
[Valid?]
  ├─ No  → Return error message
  └─ Yes → Insert into database
       ↓
    Send confirmation email
       ↓
    Notify admin
       ↓
    Redirect to thank you page
```

**Validation Rules:**
- ✅ Name: Not empty, min 3 chars
- ✅ Email: Valid email format
- ✅ Message: Not empty, min 10 chars
- ✅ Phone: Valid phone number format

**Email Notifications:**
- 📧 Confirmation to customer
- 📧 Alert to admin

---

### `gold_rate_api.php`
Fetches and manages live gold rate data.

**Functionality:**
- 🔄 Fetches current gold prices from API
- 💾 Stores rates in database
- 📊 Provides historical rate data
- 🕐 Caches rates to reduce API calls

**Main Function:**
```php
get_latest_gold_rates($conn)
```

**Returns:**
```php
[
    'date'     => '2026-08-16',
    'rates'    => [
        '24k' => 12500.00,
        '22k' => 11875.00,
        '21k' => 11450.00,
        '18k' => 9750.00
    ],
    'change'   => '+50.00',
    'currency' => 'PKR'
]
```

**API Sources:**
- Primary: Metal price provider API
- Fallback: Cached database rates
- Update frequency: Daily (can be adjusted)

**Caching Strategy:**
```
Check database for today's rates
      ↓
[Found?]
  ├─ Yes → Return cached rates
  └─ No  → Call API
       ↓
    Store in database
       ↓
    Return rates
```

---

## 🔌 API Endpoints

### Contact Form Handler

**Endpoint:**
```
POST /handlers/enquiry.php
```

**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

**Example Request:**
```bash
curl -X POST http://localhost/fahad_jewellery/handlers/enquiry.php \
  -d "name=John Doe&email=john@example.com&message=I want to inquire about gold rates"
```

**Success Response:**
```php
Redirect to: contact.php?status=success&msg=Thank+you+for+your+inquiry
```

**Error Response:**
```php
Redirect to: contact.php?status=error&msg=Please+fill+all+fields
```

---

### Gold Rate API

**Function:**
```php
require_once 'handlers/gold_rate_api.php';
$rates = get_latest_gold_rates($conn);
```

**Response:**
```php
Array (
    'date' => '2026-08-16',
    'rates' => [
        '24k' => 12500,
        '22k' => 11875,
        '21k' => 11450,
        '18k' => 9750
    ],
    'change' => '+50.00',
    'currency' => 'PKR'
)
```

---

## 🛡️ Security Features

### Input Validation
✅ **enquiry.php:**
- Validates email format with `filter_var()`
- Sanitizes text input with `trim()` & `htmlspecialchars()`
- Checks field lengths
- Prevents SQL injection with prepared statements

✅ **gold_rate_api.php:**
- Validates API responses
- Error handling for failed API calls
- Uses prepared statements for database operations

### Protection Against
✅ SQL Injection – Prepared statements
✅ XSS Attacks – Output escaping
✅ CSRF – Session validation (can add tokens)
✅ Email Spoofing – Email validation

---

## 🔧 Configuration

### Email Settings

Edit `enquiry.php`:
```php
$to_admin    = 'admin@fahad-jewellery.com';
$from_email  = 'noreply@fahad-jewellery.com';
$site_url    = 'https://fahad-jewellery.com';
```

### Gold Rate API Configuration

Edit `gold_rate_api.php`:
```php
$api_endpoint = 'https://api.goldrates.com/latest';  // API endpoint
$cache_hours  = 24;                                   // Cache duration
$update_time  = '09:00 AM';                          // Update time
```

---

## 📊 Database Integration

### Inquiries Table
```sql
CREATE TABLE enquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    message TEXT,
    status ENUM('new', 'read', 'resolved'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Gold Rates Table
```sql
CREATE TABLE gold_rates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rate_date DATE UNIQUE,
    rate_24k DECIMAL(10, 2),
    rate_22k DECIMAL(10, 2),
    rate_21k DECIMAL(10, 2),
    rate_18k DECIMAL(10, 2),
    rate_change DECIMAL(8, 2),
    currency VARCHAR(3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Usage Examples

### Processing Contact Form

```php
<?php
// contact.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Form data auto-processed by enquiry.php handler
    // User receives confirmation, admin receives alert
    // Page redirects with status message
}
?>
```

### Displaying Gold Rates

```php
<?php
require_once 'handlers/gold_rate_api.php';
$rates = get_latest_gold_rates($conn);
?>

<div class="gold-rates">
    <h3>Today's Rates (<?php echo $rates['date']; ?>)</h3>
    <p>24K: PKR <?php echo number_format($rates['rates']['24k'], 2); ?></p>
    <p>21K: PKR <?php echo number_format($rates['rates']['21k'], 2); ?></p>
    <p>Change: <?php echo $rates['change']; ?> PKR</p>
</div>
```

---

## 🧪 Testing

### Test Enquiry Handler

```php
// Test form submission
POST /handlers/enquiry.php
name=Test User
email=test@example.com
message=This is a test inquiry with more than 10 characters
```

### Test Gold Rate API

```php
require_once 'config/db.php';
require_once 'handlers/gold_rate_api.php';

$rates = get_latest_gold_rates($conn);
print_r($rates);  // Should display current rates
```

---

## 🐛 Troubleshooting

### Emails Not Sending
**Problem:** Inquiries stored but no email received
**Solution:**
- Check PHP `mail()` function enabled in php.ini
- Verify SMTP settings
- Check spam folder for emails
- Test with simple mail script

### Gold Rates Not Updating
**Problem:** Old rates displayed
**Solution:**
- Check API endpoint is working
- Verify internet connection
- Check API rate limits (may need authentication)
- Review error logs

### Form Validation Errors
**Problem:** "Please fill all fields" error
**Solution:**
- Ensure all required fields are sent
- Check email format is valid
- Verify message length > 10 chars
- Review browser console for errors

---

## 📈 Performance Optimization

### Caching Gold Rates
- ✅ Cached in database for 24 hours
- ✅ Reduces external API calls
- ✅ Faster page load times
- ✅ Graceful fallback if API down

### Inquiry Processing
- ✅ Async email sending (can be improved with queue)
- ✅ Indexed database columns for faster queries
- ✅ Batch processing for multiple inquiries

---

## 📝 Logging & Monitoring

### Enable Logging

Add to handlers:
```php
error_log("Inquiry received from: " . $email);
error_log("Gold rate update at: " . date('Y-m-d H:i:s'));
```

### Monitor Errors

Check PHP error log:
```
/var/log/php/error.log
```

---

**Last Updated:** 2026-08-16  
**Version:** 2.0
