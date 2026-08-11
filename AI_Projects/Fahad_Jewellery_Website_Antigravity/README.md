# 💎 Fahad Jewellery – Web Application & Admin Dashboard

Welcome to the official repository for **Fahad Jewellery**, a luxury e-commerce web platform for bespoke diamond engagement rings, royal gemstone pendants, and fine jewelry.

---

## 🔗 Quick URL Reference

| Interface | Running via CMD (Vite Dev Server) | Running via XAMPP (Apache) |
| :--- | :--- | :--- |
| 🌐 **Main Website** | `http://localhost:5173/` | `http://localhost/Fahad_Jewellery_Website/` |
| 👑 **Admin Panel** | `http://localhost:5173/admin.html` | `http://localhost/Fahad_Jewellery_Website/admin.html` |
| 🗄️ **XAMPP Database (phpMyAdmin)** | N/A | `http://localhost/phpmyadmin` |

*(Note: If using XAMPP with built dist files, access via `http://localhost/Fahad_Jewellery_Website/dist/` or `http://localhost/Fahad_Jewellery_Website/dist/admin.html`)*

---

## 🚀 Option 1: How to Run Using Command Prompt (CMD)

Using Node.js and Vite gives you live auto-reloading and fast development.

### Step 1: Open Command Prompt (CMD)
Press `Win + R`, type `cmd`, and press **Enter**.

### Step 2: Navigate to the Project Directory
Run the following command in CMD:
```cmd
cd "C:\Users\RAHIM SONS COM\Desktop\Fahad_Jewellery_Website"
```

### Step 3: Install Project Dependencies
Run the installation command (only needed the first time):
```cmd
npm install
```

### Step 4: Start Development Server
Launch the live development server:
```cmd
npm run dev
```

### Step 5: Access the Website & Admin Panel
Open your web browser (Chrome, Edge, Firefox) and navigate to:
- **Website URL:** [http://localhost:5173/](http://localhost:5173/)
- **Admin Panel URL:** [http://localhost:5173/admin.html](http://localhost:5173/admin.html)

*(To stop the CMD server at any time, press `Ctrl + C` in CMD and type `Y`)*

---

## 🛠️ Option 2: How to Run Using XAMPP Server

Running with XAMPP allows you to host static HTML/JS assets via Apache and connect MySQL database via phpMyAdmin.

### Step 1: Place Project in XAMPP `htdocs`
1. Open File Explorer.
2. Copy the entire `Fahad_Jewellery_Website` folder to your XAMPP web root directory:
   `C:\xampp\htdocs\` (or `D:\XAMPP\htdocs\` if XAMPP is installed on D drive)
3. Target Path should be:
   `C:\xampp\htdocs\Fahad_Jewellery_Website` (or `D:\XAMPP\htdocs\Fahad_Jewellery_Website`)

*(Alternative shortcut: You can also copy the contents of the `dist/` folder after running `npm run build` directly into `C:\xampp\htdocs\Fahad_Jewellery_Website`)*

### Step 2: Start Apache & MySQL in XAMPP
1. Open **XAMPP Control Panel** (`xampp-control.exe`).
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL** (if using MySQL database features).
4. Verify that the ports (e.g., Port `80`, `443`, `3306`) turn green.

### Step 3: Access the Website & Admin Panel in Browser
Open your browser and visit:
- 🌐 **Main Website URL:** [http://localhost/Fahad_Jewellery_Website/](http://localhost/Fahad_Jewellery_Website/)
- 👑 **Admin Panel URL:** [http://localhost/Fahad_Jewellery_Website/admin.html](http://localhost/Fahad_Jewellery_Website/admin.html)
- 🗄️ **phpMyAdmin Database Panel URL:** [http://localhost/phpmyadmin](http://localhost/phpmyadmin)

*(Note: If your XAMPP Apache is set to a custom port like `8080`, replace `localhost` with `localhost:8080`)*

---

## 📦 Production Build Command

To generate an optimized, minified production build for live server deployment:

```cmd
npm run build
```

The output files will be generated inside the `dist/` directory.

---

## 📂 Project Structure

```text
Fahad_Jewellery_Website/
├── assets/             # Brand images, icons, and hero photography
├── dist/               # Production build output
├── src/                # Source CSS and JS application logic
│   ├── app.js          # Cart, wishlist, tabs, and modal interactions
│   └── style.css       # Custom styles and Tailwind imports
├── admin.html          # Admin Management Dashboard
├── index.html          # Main Customer Storefront Website
├── package.json        # Node.js dependencies & scripts
├── tailwind.config.js  # Luxury color theme & styling tokens
├── vite.config.js      # Multi-page build configuration
└── README.md           # Instructions & setup documentation
```

---

## 📞 Support & Information
For technical queries or customization, contact **Fahad Jewellery Admin Support**.
