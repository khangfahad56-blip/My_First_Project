/**
 * database.js — sql.js wrapper for Pak Nutrition Tracker
 * sql.js is pure JavaScript — no C++ compiler or Visual Studio required.
 * Data is persisted to disk (db/nutrition.db binary file) on every write.
 */
const path = require("path");
const fs   = require("fs");
const initSqlJs = require("sql.js");

const DB_PATH = path.join(__dirname, "nutrition.db");
const foodsData = require("./foods-data");

let _db = null;          // sql.js Database instance
let _saveScheduled = false;

// ─── persist to disk (debounced 200 ms) ────────────────────────────────────
function scheduleSave() {
  if (_saveScheduled) return;
  _saveScheduled = true;
  setImmediate(() => {
    _saveScheduled = false;
    try {
      const data = _db.export();          // Uint8Array
      fs.writeFileSync(DB_PATH, Buffer.from(data));
    } catch (e) {
      console.error("DB save error:", e.message);
    }
  });
}

// ─── sql.js sync-style helpers (mirrors better-sqlite3 API) ────────────────
function exec(sql) {
  _db.run(sql);
  scheduleSave();
}

function prepare(sql) {
  return {
    _sql: sql,
    run(...params)  { _db.run(sql, flatParams(params)); scheduleSave(); return { lastInsertRowid: getLastId() }; },
    get(...params)  { return first(_db.exec(sql, flatParams(params))); },
    all(...params)  { return rows(_db.exec(sql,  flatParams(params))); },
  };
}

function flatParams(params) {
  // sql.js wants [val, val, ...] — handle single-array call
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
}

function getLastId() {
  const r = _db.exec("SELECT last_insert_rowid() AS id");
  return rows(r)[0]?.id ?? null;
}

function first(resultSet) {
  if (!resultSet || resultSet.length === 0) return undefined;
  const { columns, values } = resultSet[0];
  if (!values || values.length === 0) return undefined;
  return Object.fromEntries(columns.map((c, i) => [c, values[0][i]]));
}

function rows(resultSet) {
  if (!resultSet || resultSet.length === 0) return [];
  const { columns, values } = resultSet[0];
  return (values || []).map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
}

// ─── schema ────────────────────────────────────────────────────────────────
const SCHEMA = `
CREATE TABLE IF NOT EXISTS foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  serving_size TEXT NOT NULL,
  serving_grams REAL NOT NULL,
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
  bmr REAL, tdee REAL,
  target_calories REAL, target_protein REAL,
  target_fat REAL, target_carbs REAL, target_water_ml REAL,
  goal_weight_kg REAL,
  calorie_diff REAL,
  target_fiber REAL
);
CREATE TABLE IF NOT EXISTS meal_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_date TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  food_id INTEGER,
  food_name TEXT NOT NULL,
  quantity REAL NOT NULL,
  calories REAL NOT NULL,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fat REAL NOT NULL,
  fiber REAL NOT NULL,
  sugar REAL NOT NULL,
  sodium REAL NOT NULL,
  potassium REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
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
  terrain TEXT DEFAULT 'flat',
  walk_type TEXT DEFAULT 'normal',
  speed_kmh REAL,
  met_used REAL,
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
  chest_cm REAL, waist_cm REAL, hips_cm REAL,
  arm_cm REAL, thigh_cm REAL, body_fat_pct REAL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  food_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`;

// ─── migrations: add new columns to pre-existing databases ────────────────
// SQLite has no "ADD COLUMN IF NOT EXISTS", so we check pragma table_info first.
// This preserves all existing user data (project requirement #10: backward compatibility).
function columnExists(table, column) {
  const info = rows(_db.exec(`PRAGMA table_info(${table})`));
  return info.some((c) => c.name === column);
}

function addColumnIfMissing(table, column, ddl) {
  if (!columnExists(table, column)) {
    _db.run(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}

function runMigrations() {
  addColumnIfMissing("profile", "goal_weight_kg", "goal_weight_kg REAL");
  addColumnIfMissing("profile", "calorie_diff", "calorie_diff REAL");
  addColumnIfMissing("profile", "target_fiber", "target_fiber REAL");
  addColumnIfMissing("walking_logs", "terrain", "terrain TEXT DEFAULT 'flat'");
  addColumnIfMissing("walking_logs", "walk_type", "walk_type TEXT DEFAULT 'normal'");
  addColumnIfMissing("walking_logs", "speed_kmh", "speed_kmh REAL");
  addColumnIfMissing("walking_logs", "met_used", "met_used REAL");
}

// ─── seed default profile ───────────────────────────────────────────────────
function seedProfile() {
  const existing = prepare("SELECT id FROM profile WHERE id = 1").get();
  if (existing) return;
  const calc = require("../utils/calculations");
  const d = { gender:"male", age:25, height_cm:170, weight_kg:70, activity_level:"moderate", goal:"maintenance" };
  const bmr  = calc.calcBMR({ gender:d.gender, weightKg:d.weight_kg, heightCm:d.height_cm, age:d.age });
  const tdee = calc.calcTDEE(bmr, d.activity_level);
  const { targetCalories: tc } = calc.calcTargetCaloriesAdvanced({ tdee, goalType:d.goal, calorieDiff:null });
  const tp   = calc.calcProtein(d.weight_kg, d.goal);
  const tf   = calc.calcFat(d.weight_kg, d.goal);
  const tcarb= calc.calcCarbs(tc, tp, tf);
  const tw   = calc.calcWaterIntake(d.weight_kg, d.activity_level);
  const tfiber = calc.calcFiber(tc);
  prepare(`INSERT INTO profile (id,gender,age,height_cm,weight_kg,activity_level,goal,
      bmr,tdee,target_calories,target_protein,target_fat,target_carbs,target_water_ml,
      goal_weight_kg,calorie_diff,target_fiber)
    VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(d.gender,d.age,d.height_cm,d.weight_kg,d.activity_level,d.goal,bmr,tdee,tc,tp,tf,tcarb,tw,
      d.weight_kg,0,tfiber);
  const today = new Date().toISOString().slice(0,10);
  prepare("INSERT INTO weight_logs (log_date,weight_kg) VALUES (?,?)").run(today, d.weight_kg);
}

// ─── initialise (async, called once at startup) ─────────────────────────────
async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(fileBuffer);
  } else {
    _db = new SQL.Database();
  }

  // Create tables
  _db.run(SCHEMA);

  // Migrate any pre-existing database to the current schema (adds new columns, keeps old data)
  runMigrations();

  // Seed foods
  const count = first(_db.exec("SELECT COUNT(*) AS c FROM foods"));
  if (!count || count.c === 0) {
    _db.run("BEGIN");
    for (const row of foodsData) {
      _db.run(
        `INSERT INTO foods (name,category,serving_size,serving_grams,calories,protein,carbs,fat,fiber,sugar,sodium,potassium)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, row
      );
    }
    _db.run("COMMIT");
    console.log(`✅ Seeded ${foodsData.length} Pakistani foods.`);
  }

  seedProfile();
  scheduleSave();
  console.log("✅ Database ready.");
}

module.exports = { initDatabase, prepare, exec };
