const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");
const calc    = require("../utils/calculations");
const today   = () => new Date().toISOString().slice(0,10);

router.get("/", (req, res) => {
  try {
    const date = req.query.date || today();
    const logs = prepare("SELECT * FROM walking_logs WHERE log_date=? ORDER BY created_at ASC").all(date);
    const totalCalories = logs.reduce((s,l)=>s+(l.calories_burned||0),0);
    const totalDistance = logs.reduce((s,l)=>s+(l.distance_km||0),0);
    const totalSteps    = logs.reduce((s,l)=>s+(l.steps||0),0);
    const totalDuration = logs.reduce((s,l)=>s+(l.duration_min||0),0);
    res.json({ success:true, logs, totalCalories, totalDistance, totalSteps, totalDuration, date });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// POST /api/walking — logs a walk using the advanced MET-based calculator
// (project requirement #4: speed/duration/distance/terrain/type; #5: effect on goal is
// picked up automatically by /api/dashboard since it reads from this table)
router.post("/", (req, res) => {
  try {
    const { distance_km, duration_min, speed_kmh, steps, terrain, walk_type, log_date } = req.body;
    const date = log_date || today();
    const profile = prepare("SELECT weight_kg FROM profile WHERE id=1").get();
    const weightKg = profile ? profile.weight_kg : 70;

    const result = calc.calcWalkingCaloriesAdvanced({
      weightKg,
      speedKmh: speed_kmh || undefined,
      durationMin: duration_min || undefined,
      distanceKm: distance_km || undefined,
      terrain: terrain || "flat",
      walkType: walk_type || "normal",
    });

    if (!result.durationMin) {
      return res.status(400).json({ success:false, error:"Enter at least speed+time, distance+time, or speed+distance" });
    }

    const r = prepare(`INSERT INTO walking_logs
      (log_date,distance_km,duration_min,steps,calories_burned,terrain,walk_type,speed_kmh,met_used)
      VALUES (?,?,?,?,?,?,?,?,?)`)
      .run(date, result.distanceKm||null, result.durationMin||null, steps||null, result.caloriesBurned,
        terrain||"flat", walk_type||"normal", result.avgSpeedKmh||null, result.met||null);

    res.json({ success:true, id:r.lastInsertRowid, ...result });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// GET /api/walking/preview — live calculation without saving, for instant feedback in the UI
router.get("/preview", (req, res) => {
  try {
    const { distance_km, duration_min, speed_kmh, terrain, walk_type } = req.query;
    const profile = prepare("SELECT weight_kg FROM profile WHERE id=1").get();
    const weightKg = profile ? profile.weight_kg : 70;
    const result = calc.calcWalkingCaloriesAdvanced({
      weightKg,
      speedKmh: speed_kmh || undefined,
      durationMin: duration_min || undefined,
      distanceKm: distance_km || undefined,
      terrain: terrain || "flat",
      walkType: walk_type || "normal",
    });
    res.json({ success:true, ...result });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.delete("/:id", (req, res) => {
  try {
    prepare("DELETE FROM walking_logs WHERE id=?").run(+req.params.id);
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
