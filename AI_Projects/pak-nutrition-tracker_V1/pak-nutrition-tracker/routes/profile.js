const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");
const calc    = require("../utils/calculations");

function computeAndSave(p) {
  const bmr  = calc.calcBMR({ gender:p.gender, weightKg:p.weight_kg, heightCm:p.height_cm, age:p.age });
  const tdee = calc.calcTDEE(bmr, p.activity_level);
  const tc   = calc.calcTargetCalories(tdee, p.goal);
  const tp   = calc.calcProtein(p.weight_kg, p.goal);
  const tf   = calc.calcFat(p.weight_kg, p.goal);
  const tcarb= calc.calcCarbs(tc, tp, tf);
  const tw   = calc.calcWaterIntake(p.weight_kg, p.activity_level);
  prepare(`UPDATE profile SET gender=?,age=?,height_cm=?,weight_kg=?,activity_level=?,goal=?,
    bmr=?,tdee=?,target_calories=?,target_protein=?,target_fat=?,target_carbs=?,target_water_ml=?
    WHERE id=1`).run(p.gender,p.age,p.height_cm,p.weight_kg,p.activity_level,p.goal,bmr,tdee,tc,tp,tf,tcarb,tw);
  return { bmr, tdee, targetCalories:tc, targetProtein:tp, targetFat:tf, targetCarbs:tcarb, targetWater:tw };
}

router.get("/", (req, res) => {
  try {
    const profile = prepare("SELECT * FROM profile WHERE id = 1").get();
    res.json({ success:true, profile });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.put("/", (req, res) => {
  try {
    const { gender, age, height_cm, weight_kg, activity_level, goal } = req.body;
    if (!gender||!age||!height_cm||!weight_kg||!activity_level||!goal)
      return res.status(400).json({ success:false, error:"Missing required fields" });
    if (age<=0||age>120) return res.status(400).json({ success:false, error:"Invalid age" });

    const computed = computeAndSave({ gender, age:+age, height_cm:+height_cm, weight_kg:+weight_kg, activity_level, goal });

    const today = new Date().toISOString().slice(0,10);
    const ew = prepare("SELECT id FROM weight_logs WHERE log_date=?").get(today);
    if (ew) prepare("UPDATE weight_logs SET weight_kg=? WHERE id=?").run(+weight_kg, ew.id);
    else    prepare("INSERT INTO weight_logs (log_date,weight_kg) VALUES (?,?)").run(today, +weight_kg);

    const profile = prepare("SELECT * FROM profile WHERE id=1").get();
    res.json({ success:true, profile, computed });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
