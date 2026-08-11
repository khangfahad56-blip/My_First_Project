const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('pak_nutrition.db');

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gender TEXT,
        age INTEGER,
        height REAL,
        weight REAL,
        activity_level TEXT,
        goal TEXT DEFAULT 'maintain',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Food database
    db.run(`CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        calories REAL,
        protein REAL,
        carbs REAL,
        fat REAL,
        fiber REAL,
        sugar REAL,
        sodium REAL,
        potassium REAL,
        serving_size TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Daily meals
    db.run(`CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        meal_type TEXT,
        food_id INTEGER,
        food_name TEXT,
        quantity REAL,
        calories REAL,
        protein REAL,
        carbs REAL,
        fat REAL,
        fiber REAL,
        sugar REAL,
        sodium REAL,
        potassium REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Daily tracking
    db.run(`CREATE TABLE IF NOT EXISTS daily_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE,
        weight REAL,
        water_intake REAL,
        walking_distance REAL,
        walking_time REAL,
        walking_calories REAL,
        steps INTEGER,
        body_fat_percentage REAL
    )`);

    // Favorites
    db.run(`CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        food_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(food_id) REFERENCES foods(id)
    )`);

    // Search history
    db.run(`CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        searched_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Populate Pakistani foods
function populateFoods() {
    const foods = [
        ['Roti (1 medium)', 'Breads', 70, 2.5, 14, 0.5, 2, 0.5, 120, 50, '1 piece (40g)'],
        ['Chapati', 'Breads', 70, 2.5, 14, 0.5, 2, 0.5, 120, 50, '1 piece (40g)'],
        ['Tandoori Naan', 'Breads', 262, 8.5, 45, 5.1, 2, 2, 380, 120, '1 piece (100g)'],
        ['Kulcha', 'Breads', 196, 6.5, 36, 3.2, 1.5, 1.5, 320, 90, '1 piece (80g)'],
        ['Paratha (Plain)', 'Breads', 260, 5, 32, 13, 2, 1, 200, 80, '1 piece (80g)'],
        ['Aloo Paratha', 'Breads', 320, 7, 42, 15, 3, 2, 300, 200, '1 piece (100g)'],
        ['Puri (Fried)', 'Breads', 142, 3, 20, 6, 1, 0.5, 150, 40, '1 piece (40g)'],
        ['Sheermal', 'Breads', 230, 6, 40, 6, 1, 8, 250, 100, '1 piece (70g)'],
        ['Roghni Naan', 'Breads', 300, 8, 48, 8, 2, 3, 400, 130, '1 piece (120g)'],
        ['Garlic Naan', 'Breads', 300, 9, 46, 10, 2, 2, 420, 140, '1 piece (120g)'],
        ['Butter Naan', 'Breads', 320, 8, 48, 12, 2, 3, 450, 150, '1 piece (130g)'],
        ['Boiled Egg', 'Eggs', 78, 6.3, 0.6, 5.3, 0, 0.6, 62, 63, '1 large egg (50g)'],
        ['Omelette (2 eggs)', 'Eggs', 220, 14, 2, 18, 0, 1, 300, 150, '1 serving (120g)'],
        ['Chicken Karahi', 'Chicken', 380, 35, 8, 24, 2, 3, 600, 400, '1 serving (200g)'],
        ['Chicken Biryani', 'Rice', 520, 28, 55, 22, 3, 4, 800, 450, '1 plate (300g)'],
        ['Chicken Pulao', 'Rice', 450, 25, 58, 15, 2, 3, 700, 350, '1 plate (280g)'],
        ['White Rice (Cooked)', 'Rice', 205, 4.2, 44.5, 0.4, 0.6, 0.1, 1, 55, '1 cup (158g)'],
        ['Brown Rice (Cooked)', 'Rice', 216, 5, 45, 1.8, 3.5, 0.7, 10, 84, '1 cup (195g)'],
        ['Daal Chawal', 'Lentils', 380, 15, 65, 8, 8, 2, 400, 500, '1 plate (300g)'],
        ['Masoor Daal', 'Lentils', 210, 14, 32, 4, 8, 2, 380, 450, '1 cup (200g)'],
        ['Chana Daal', 'Lentils', 230, 13, 35, 5, 9, 2, 350, 480, '1 cup (200g)'],
        ['Kabuli Chana', 'Lentils', 269, 14.5, 45, 4.2, 12.5, 8, 400, 477, '1 cup (164g)'],
        ['Rajma', 'Lentils', 225, 15, 40, 2, 13, 1, 320, 600, '1 cup (177g)'],
        ['Lobia', 'Lentils', 200, 13, 35, 2, 11, 3, 300, 500, '1 cup (170g)'],
        ['Palak Sabzi', 'Vegetables', 80, 5, 10, 2, 4, 2, 250, 500, '1 cup (180g)'],
        ['Bhindi', 'Vegetables', 90, 3, 14, 3, 5, 3, 200, 400, '1 cup (160g)'],
        ['Aloo Curry', 'Vegetables', 180, 3, 30, 6, 3, 2, 300, 600, '1 cup (200g)'],
        ['Aloo Gosht', 'Meat', 350, 25, 20, 20, 3, 2, 500, 600, '1 serving (250g)'],
        ['Mutton Karahi', 'Meat', 420, 35, 6, 30, 1, 2, 650, 450, '1 serving (200g)'],
        ['Beef Karahi', 'Meat', 400, 38, 5, 26, 1, 1, 600, 500, '1 serving (200g)'],
        ['Seekh Kabab', 'Meat', 180, 18, 3, 11, 1, 1, 400, 300, '1 kabab (100g)'],
        ['Shami Kabab', 'Meat', 160, 14, 8, 9, 2, 1, 380, 280, '1 kabab (80g)'],
        ['Chapli Kabab', 'Meat', 220, 20, 5, 14, 2, 2, 450, 350, '1 kabab (120g)'],
        ['Chicken Tikka', 'Chicken', 250, 30, 3, 13, 1, 2, 500, 400, '1 serving (150g)'],
        ['Chicken BBQ Leg', 'Chicken', 280, 32, 2, 16, 0, 1, 550, 380, '1 piece (150g)'],
        ['Fish Fry', 'Seafood', 300, 22, 12, 18, 1, 1, 450, 350, '1 piece (150g)'],
        ['Fish Curry', 'Seafood', 250, 25, 8, 14, 1, 2, 500, 400, '1 serving (200g)'],
        ['Milk (Full Cream)', 'Dairy', 150, 8, 12, 8, 0, 12, 100, 380, '1 glass (250ml)'],
        ['Chai', 'Beverages', 60, 2, 6, 3, 0, 5, 30, 80, '1 cup (150ml)'],
        ['Doodh Patti', 'Beverages', 100, 4, 8, 6, 0, 7, 50, 200, '1 cup (180ml)'],
        ['Lassi (Sweet)', 'Beverages', 200, 8, 28, 6, 0, 26, 120, 400, '1 glass (250ml)'],
        ['Lassi (Salty)', 'Beverages', 130, 8, 12, 5, 0, 10, 300, 400, '1 glass (250ml)'],
        ['Yogurt (Plain)', 'Dairy', 100, 8.5, 11, 3, 0, 11, 115, 380, '1 cup (200g)'],
        ['Dates (Khajoor)', 'Fruits', 282, 2.5, 75, 0.4, 8, 63, 2, 656, '100g (4-5 pieces)'],
        ['Banana', 'Fruits', 105, 1.3, 27, 0.4, 3.1, 14.4, 1, 422, '1 medium (118g)'],
        ['Apple', 'Fruits', 95, 0.5, 25, 0.3, 4.4, 19, 2, 195, '1 medium (182g)'],
        ['Orange', 'Fruits', 62, 1.2, 15.4, 0.2, 3.1, 12.2, 0, 237, '1 medium (131g)'],
        ['Mango', 'Fruits', 135, 1.1, 35, 0.6, 3.7, 30.6, 2, 323, '1 medium (200g)'],
        ['Watermelon', 'Fruits', 85, 1.7, 21, 0.4, 1.1, 17, 3, 320, '2 cups (280g)'],
        ['Peanuts (Roasted)', 'Nuts', 320, 14, 11, 26, 4, 2, 200, 350, '50g'],
        ['Almonds', 'Nuts', 290, 10.6, 10, 25, 6, 2.2, 0, 370, '50g'],
        ['Pistachios', 'Nuts', 280, 10, 14, 22, 5, 4, 200, 510, '50g'],
        ['Cashews', 'Nuts', 276, 9.2, 16, 22, 1.7, 2.8, 200, 330, '50g'],
        ['Jalebi', 'Sweets', 250, 2, 50, 5, 0, 30, 50, 30, '100g'],
        ['Gulab Jamun', 'Sweets', 175, 3, 28, 6, 0, 20, 80, 100, '2 pieces (80g)'],
        ['Kheer', 'Sweets', 320, 8, 45, 12, 1, 25, 150, 300, '1 bowl (200g)'],
        ['Ras Malai', 'Sweets', 260, 8, 28, 14, 0, 22, 120, 250, '2 pieces (100g)'],
        ['Barfi', 'Sweets', 180, 3, 25, 8, 0, 20, 60, 80, '1 piece (50g)'],
        ['Halwa', 'Sweets', 220, 2, 35, 9, 0, 25, 40, 60, '50g'],
        ['Shawarma', 'Fast Food', 450, 25, 35, 24, 2, 3, 800, 350, '1 wrap (200g)'],
        ['Burger (Chicken)', 'Fast Food', 420, 22, 38, 20, 2, 6, 650, 280, '1 burger (180g)'],
        ['Pizza (2 slices)', 'Fast Food', 500, 24, 52, 22, 2, 4, 900, 300, '2 slices (200g)'],
        ['French Fries', 'Fast Food', 320, 4, 40, 16, 4, 0.5, 250, 600, '1 serving (120g)'],
        ['Samosa (Vegetable)', 'Snacks', 150, 3, 18, 8, 2, 1, 200, 100, '1 piece (60g)'],
        ['Samosa (Chicken)', 'Snacks', 200, 8, 16, 12, 1, 1, 300, 150, '1 piece (70g)'],
        ['Pakora (Mix)', 'Snacks', 180, 4, 15, 12, 2, 1, 250, 150, '4-5 pieces (80g)'],
        ['Chicken Nuggets', 'Fast Food', 280, 16, 18, 17, 1, 1, 500, 200, '6 pieces (100g)']
    ];

    db.get("SELECT COUNT(*) as count FROM foods", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO foods (name, category, calories, protein, carbs, fat, fiber, sugar, sodium, potassium, serving_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foods.forEach(food => stmt.run(...food));
            stmt.finalize();
            console.log('Database populated with Pakistani foods');
        }
    });
}

populateFoods();

// API Routes

// Get user profile
app.get('/api/profile', (req, res) => {
    db.get("SELECT * FROM user_profile ORDER BY id DESC LIMIT 1", (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row || {});
    });
});

// Update user profile
app.post('/api/profile', (req, res) => {
    const { gender, age, height, weight, activity_level, goal } = req.body;
    db.run("DELETE FROM user_profile");
    db.run(
        "INSERT INTO user_profile (gender, age, height, weight, activity_level, goal) VALUES (?, ?, ?, ?, ?, ?)",
        [gender, age, height, weight, activity_level, goal],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Profile saved' });
        }
    );
});

// Search foods
app.get('/api/foods', (req, res) => {
    const { search, category } = req.query;
    let query = "SELECT * FROM foods WHERE 1=1";
    const params = [];
    
    if (search) {
        query += " AND name LIKE ?";
        params.push(`%${search}%`);
    }
    if (category && category !== 'All') {
        query += " AND category = ?";
        params.push(category);
    }
    
    query += " ORDER BY name LIMIT 50";
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get categories
app.get('/api/categories', (req, res) => {
    db.all("SELECT DISTINCT category FROM foods ORDER BY category", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(r => r.category));
    });
});

// Add meal
app.post('/api/meals', (req, res) => {
    const { date, meal_type, food_id, food_name, quantity, calories, protein, carbs, fat, fiber, sugar, sodium, potassium } = req.body;
    
    db.run(
        `INSERT INTO meals (date, meal_type, food_id, food_name, quantity, calories, protein, carbs, fat, fiber, sugar, sodium, potassium) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [date, meal_type, food_id, food_name, quantity, calories, protein, carbs, fat, fiber, sugar, sodium, potassium],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Meal added' });
        }
    );
});

// Get meals for date
app.get('/api/meals/:date', (req, res) => {
    db.all("SELECT * FROM meals WHERE date = ? ORDER BY meal_type, created_at", [req.params.date], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Delete meal
app.delete('/api/meals/:id', (req, res) => {
    db.run("DELETE FROM meals WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Meal deleted' });
    });
});

// Get daily tracking
app.get('/api/tracking/:date', (req, res) => {
    db.get("SELECT * FROM daily_tracking WHERE date = ?", [req.params.date], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row || {});
    });
});

// Update daily tracking
app.post('/api/tracking', (req, res) => {
    const { date, weight, water_intake, walking_distance, walking_time, walking_calories, steps, body_fat_percentage } = req.body;
    
    db.run(
        `INSERT OR REPLACE INTO daily_tracking (date, weight, water_intake, walking_distance, walking_time, walking_calories, steps, body_fat_percentage) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [date, weight, water_intake, walking_distance, walking_time, walking_calories, steps, body_fat_percentage],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Tracking updated' });
        }
    );
});

// Get history
app.get('/api/history/:period', (req, res) => {
    let dateCondition;
    switch(req.params.period) {
        case 'week': dateCondition = "date >= date('now', '-7 days')"; break;
        case 'month': dateCondition = "date >= date('now', '-30 days')"; break;
        default: dateCondition = "1=1";
    }
    
    db.all(`SELECT date, SUM(calories) as total_calories, SUM(protein) as total_protein, SUM(carbs) as total_carbs, SUM(fat) as total_fat FROM meals WHERE ${dateCondition} GROUP BY date ORDER BY date`, (err, meals) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        db.all(`SELECT * FROM daily_tracking WHERE ${dateCondition} ORDER BY date`, (err, tracking) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ meals, tracking });
        });
    });
});

// Export
app.get('/api/export/:format', (req, res) => {
    db.all(`SELECT m.*, f.category FROM meals m LEFT JOIN foods f ON m.food_id = f.id ORDER BY m.date DESC, m.meal_type`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (req.params.format === 'csv') {
            const keys = Object.keys(rows[0] || {});
            const csv = [keys.join(','), ...rows.map(row => keys.map(key => `"${row[key] || ''}"`).join(','))].join('\n');
            res.header('Content-Type', 'text/csv');
            res.attachment('nutrition_data.csv');
            res.send(csv);
        } else {
            res.json(rows);
        }
    });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Pak Nutrition Tracker running on http://localhost:${PORT}`);
});