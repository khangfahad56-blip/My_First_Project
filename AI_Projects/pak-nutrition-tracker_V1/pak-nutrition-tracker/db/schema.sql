-- Pak Nutrition Tracker Database Schema

CREATE TABLE IF NOT EXISTS foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  serving_size TEXT NOT NULL,   -- e.g. "1 piece (60g)"
  serving_grams REAL NOT NULL,  -- grams per serving, used for scaling
  calories REAL NOT NULL,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fat REAL NOT NULL,
  fiber REAL NOT NULL,
  sugar REAL NOT NULL,
  sodium REAL NOT NULL,
  potassium REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  gender TEXT DEFAULT 'male',
  age INTEGER DEFAULT 25,
  height_cm REAL DEFAULT 170,
  weight_kg REAL DEFAULT 70,
  activity_level TEXT DEFAULT 'moderate',
  goal TEXT DEFAULT 'maintain',
  bmr REAL,
  tdee REAL,
  target_calories REAL,
  target_protein REAL,
  target_fat REAL,
  target_carbs REAL,
  target_water_ml REAL
);

CREATE TABLE IF NOT EXISTS meal_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_date TEXT NOT NULL,       -- YYYY-MM-DD
  meal_type TEXT NOT NULL,      -- breakfast/lunch/dinner/snack
  food_id INTEGER,
  food_name TEXT NOT NULL,
  quantity REAL NOT NULL,       -- number of servings
  calories REAL NOT NULL,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fat REAL NOT NULL,
  fiber REAL NOT NULL,
  sugar REAL NOT NULL,
  sodium REAL NOT NULL,
  potassium REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (food_id) REFERENCES foods(id)
);

CREATE TABLE IF NOT EXISTS water_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_date TEXT NOT NULL,
  amount_ml REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS walking_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_date TEXT NOT NULL,
  distance_km REAL,
  duration_min REAL,
  steps INTEGER,
  calories_burned REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS weight_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_date TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS body_measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_date TEXT NOT NULL,
  chest_cm REAL,
  waist_cm REAL,
  hips_cm REAL,
  arm_cm REAL,
  thigh_cm REAL,
  body_fat_pct REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  food_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (food_id) REFERENCES foods(id)
);

CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_meal_logs_date ON meal_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_water_logs_date ON water_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_walking_logs_date ON walking_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_weight_logs_date ON weight_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
