const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");
const calc    = require("../utils/calculations");
const today = () => new Date().toISOString().slice(0,10);

router.get("/", (req, res) => {
  try {
    const date = req.query.date || today();
    const logs  = prepare("SELECT * FROM water_logs WHERE log_date=? ORDER BY created_at ASC").all(date);
    const total = logs.reduce((s,l) => s+l.amount_ml, 0);
    res.json({ success:true, logs, total, date });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// GET /api/water/recommendation — full hydration breakdown (project requirement #6)
router.get("/recommendation", (req, res) => {
  try {
    const { weather, walking_min, workout_min } = req.query;
    const profile = prepare("SELECT weight_kg, activity_level FROM profile WHERE id=1").get();
    const weightKg = profile ? profile.weight_kg : 70;
    const activityLevel = profile ? profile.activity_level : "moderate";

    const rec = calc.calcWaterIntakeAdvanced({
      weightKg,
      weather: weather || "normal",
      activityLevel,
      walkingMin: walking_min || 0,
      workoutMin: workout_min || 0,
    });
    res.json({ success:true, ...rec });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post("/", (req, res) => {
  try {
    const { amount_ml, log_date } = req.body;
    if (!amount_ml||amount_ml<=0) return res.status(400).json({ success:false, error:"Invalid amount" });
    const date = log_date || today();
    const r = prepare("INSERT INTO water_logs (log_date,amount_ml) VALUES (?,?)").run(date, +amount_ml);
    res.json({ success:true, id:r.lastInsertRowid });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.delete("/:id", (req, res) => {
  try {
    prepare("DELETE FROM water_logs WHERE id=?").run(+req.params.id);
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
