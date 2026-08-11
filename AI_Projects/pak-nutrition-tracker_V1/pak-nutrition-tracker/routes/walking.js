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
    res.json({ success:true, logs, totalCalories, totalDistance, totalSteps, date });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post("/", (req, res) => {
  try {
    const { distance_km, duration_min, steps, log_date } = req.body;
    const date = log_date || today();
    const profile = prepare("SELECT weight_kg FROM profile WHERE id=1").get();
    const weightKg = profile ? profile.weight_kg : 70;
    const caloriesBurned = calc.calcWalkingCalories({ weightKg, distanceKm:+distance_km||0, durationMin:+duration_min||0 });
    const r = prepare(`INSERT INTO walking_logs (log_date,distance_km,duration_min,steps,calories_burned) VALUES (?,?,?,?,?)`)
      .run(date, distance_km||null, duration_min||null, steps||null, caloriesBurned);
    res.json({ success:true, id:r.lastInsertRowid, caloriesBurned });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.delete("/:id", (req, res) => {
  try {
    prepare("DELETE FROM walking_logs WHERE id=?").run(+req.params.id);
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
