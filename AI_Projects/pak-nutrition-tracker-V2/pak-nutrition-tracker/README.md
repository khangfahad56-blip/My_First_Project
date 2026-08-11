# 🥗 Pak Nutrition Tracker

A modern calorie and macronutrient tracker built specifically for Pakistani foods and cuisine — BMR/TDEE/BMI/body-fat calculators, a 267-item Pakistani food database, meal tracking, water & walking logs, weight/measurement history, progress charts, and exportable reports. No login required — everything is stored locally in a SQLite database on your machine.

## Tech Stack
- **Frontend:** HTML5, Tailwind CSS (CDN), vanilla JavaScript, Chart.js
- **Backend:** Node.js + Express.js
- **Database:** SQLite (via `better-sqlite3`) — zero external setup, works out of the box

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open your browser
http://localhost:3000
```

The SQLite database (`db/nutrition.db`) is created automatically the first time you run the app, and seeded with 267 Pakistani foods across 16 categories (Breads, Rice, Daal & Lentils, Vegetables, Meat & Curries, Kababs & BBQ, Fish & Seafood, Breakfast & Eggs, Dairy, Fruits, Nuts & Dry Fruits, Sweets & Desserts, Fast Food, Beverages, Snacks, and Extras/condiments).

To change the port: `PORT=4000 npm start`

## Features

- **Dashboard** — calorie ring, macro breakdown, water/walking/weight/BMI stat cards, estimated body fat
- **Calculator** — BMR, TDEE, target calories, protein/fat/carb targets, BMI, ideal weight, water intake, walking calories burned, and estimated weekly fat loss/gain — all update live as you type, with a "Save Profile" button to persist your targets
- **Meal Tracker** — log foods to Breakfast / Lunch / Dinner / Snack, adjustable serving quantities, plus quick water and walking logging
- **Food Database** — instant search, category filters, favorites (★), recent search history
- **History** — Today / Yesterday / This Week / This Month table view; click a row to jump to that day on the Dashboard
- **Progress** — charts for daily calories, macros, weight trend, walking calories, BMI, and estimated body fat % over time
- **Reports** — Daily / Weekly / Monthly reports with full food logs, exportable to CSV or printable/saveable as PDF via your browser's print dialog
- **Settings & Goals** — switch between Lose Weight / Lose Fat / Maintain / Gain Muscle / Gain Weight, log weight over time, track body measurements (chest, waist, hips, arm, thigh, body fat %)
- **Dark mode / Light mode** toggle (persisted locally)

## Project Structure

```
pak-nutrition-tracker/
├── server.js              # Express app entry point
├── db/
│   ├── schema.sql         # SQLite table definitions
│   ├── foods-data.js      # 267 Pakistani foods with full macros
│   └── database.js        # DB connection + auto-seed on first run
├── routes/                # Express route handlers (foods, meals, water, walking, weight, profile, dashboard)
├── utils/
│   └── calculations.js    # Shared BMR/TDEE/BMI/etc. formulas (server-side)
└── public/
    ├── index.html
    ├── css/styles.css     # Glassmorphism, animations, dark mode
    └── js/                # api.js, state.js, and one module per page
```

## Notes on the Nutrition Formulas
- **BMR:** Mifflin-St Jeor equation (Men: 10W + 6.25H − 5A + 5, Women: 10W + 6.25H − 5A − 161)
- **TDEE:** BMR × activity multiplier (1.2 – 1.9)
- **Protein:** 1.6–2.2 g/kg depending on goal
- **Fat:** 0.6–1.0 g/kg depending on goal
- **Carbs:** remaining calories after protein and fat
- **Weekly fat loss/gain:** based on 7700 kcal ≈ 1 kg fat
- **Walking calories:** MET-based estimate (~3.5 METs walking pace)
- **Body fat %:** Deurenberg BMI-based estimate (a simplified formula — for precise tracking use body measurements/calipers)

All figures are estimates for general tracking purposes, not medical advice.
