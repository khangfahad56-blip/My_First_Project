const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");
const calc    = require("../utils/calculations");

// Computes and persists all derived targets for the profile (project requirement #1)
function computeAndSave(p) {
  const bmr  = calc.calcBMR({ gender:p.gender, weightKg:p.weight_kg, heightCm:p.height_cm, age:p.age });
  const tdee = calc.calcTDEE(bmr, p.activity_level);
  const { targetCalories: tc, appliedDiff } = calc.calcTargetCaloriesAdvanced({
    tdee, goalType: p.goal, calorieDiff: p.calorie_diff,
  });
  const tp    = calc.calcProtein(p.weight_kg, p.goal);
  const tf    = calc.calcFat(p.weight_kg, p.goal);
  const tcarb = calc.calcCarbs(tc, tp, tf);
  const tw    = calc.calcWaterIntake(p.weight_kg, p.activity_level);
  const tfiber= calc.calcFiber(tc);
  const goalWeightKg = p.goal_weight_kg || p.weight_kg;

  prepare(`UPDATE profile SET gender=?,age=?,height_cm=?,weight_kg=?,activity_level=?,goal=?,
    bmr=?,tdee=?,target_calories=?,target_protein=?,target_fat=?,target_carbs=?,target_water_ml=?,
    goal_weight_kg=?,calorie_diff=?,target_fiber=?
    WHERE id=1`)
    .run(p.gender,p.age,p.height_cm,p.weight_kg,p.activity_level,p.goal,bmr,tdee,tc,tp,tf,tcarb,tw,
      goalWeightKg, appliedDiff, tfiber);

  // Weekly rate + fat/water/lean split + safety warning + goal date
  const weeklyRateKg = calc.calcWeeklyFatLoss(appliedDiff); // positive if deficit, negative if surplus
  const composition   = calc.calcBodyCompositionChange({ dailyCalorieDiff: appliedDiff * -1, weightKg: p.weight_kg, goalType: p.goal });
  const goalDate       = calc.calcGoalDate({ currentWeightKg: p.weight_kg, goalWeightKg, weeklyRateKg: -composition.totalScaleChangeKg });
  const warning         = calc.deficitSafetyWarning(appliedDiff);

  return {
    bmr, tdee, targetCalories:tc, targetProtein:tp, targetFat:tf, targetCarbs:tcarb,
    targetWater:tw, targetFiber:tfiber, appliedDiff, weeklyRateKg,
    composition, goalDate, warning, goalWeightKg,
  };
}

router.get("/", (req, res) => {
  try {
    const profile = prepare("SELECT * FROM profile WHERE id = 1").get();
    res.json({ success:true, profile, goalTypes: calc.GOAL_TYPES });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.put("/", (req, res) => {
  try {
    const { gender, age, height_cm, weight_kg, activity_level, goal, goal_weight_kg, calorie_diff } = req.body;
    if (!gender||!age||!height_cm||!weight_kg||!activity_level||!goal)
      return res.status(400).json({ success:false, error:"Missing required fields" });
    if (age<=0||age>120) return res.status(400).json({ success:false, error:"Invalid age" });
    if (height_cm<50||height_cm>250) return res.status(400).json({ success:false, error:"Invalid height" });
    if (weight_kg<=0||weight_kg>500) return res.status(400).json({ success:false, error:"Invalid weight" });

    const computed = computeAndSave({
      gender, age:+age, height_cm:+height_cm, weight_kg:+weight_kg, activity_level, goal,
      goal_weight_kg: goal_weight_kg!=null && goal_weight_kg!=="" ? +goal_weight_kg : null,
      calorie_diff: calorie_diff!=null && calorie_diff!=="" ? +calorie_diff : null,
    });

    const today = new Date().toISOString().slice(0,10);
    const ew = prepare("SELECT id FROM weight_logs WHERE log_date=?").get(today);
    if (ew) prepare("UPDATE weight_logs SET weight_kg=? WHERE id=?").run(+weight_kg, ew.id);
    else    prepare("INSERT INTO weight_logs (log_date,weight_kg) VALUES (?,?)").run(today, +weight_kg);

    const profile = prepare("SELECT * FROM profile WHERE id=1").get();
    res.json({ success:true, profile, computed });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// GET /api/profile/goal-preview — live preview without saving, used by the calculator page
// as the user tweaks inputs (project requirement #1: weekly weight loss prediction).
router.get("/goal-preview", (req, res) => {
  try {
    const { gender, age, height_cm, weight_kg, activity_level, goal, goal_weight_kg, calorie_diff } = req.query;
    if (!gender||!age||!height_cm||!weight_kg||!activity_level||!goal)
      return res.status(400).json({ success:false, error:"Missing required fields" });

    const p = {
      gender, age:+age, height_cm:+height_cm, weight_kg:+weight_kg, activity_level, goal,
      goal_weight_kg: goal_weight_kg ? +goal_weight_kg : +weight_kg,
      calorie_diff: calorie_diff!==undefined && calorie_diff!=="" ? +calorie_diff : null,
    };
    const bmr  = calc.calcBMR({ gender:p.gender, weightKg:p.weight_kg, heightCm:p.height_cm, age:p.age });
    const tdee = calc.calcTDEE(bmr, p.activity_level);
    const { targetCalories, appliedDiff } = calc.calcTargetCaloriesAdvanced({ tdee, goalType:p.goal, calorieDiff:p.calorie_diff });
    const tp = calc.calcProtein(p.weight_kg, p.goal);
    const tf = calc.calcFat(p.weight_kg, p.goal);
    const tcarb = calc.calcCarbs(targetCalories, tp, tf);
    const tfiber = calc.calcFiber(targetCalories);

    const composition = calc.calcBodyCompositionChange({ dailyCalorieDiff: appliedDiff * -1, weightKg: p.weight_kg, goalType: p.goal });
    const goalDate = calc.calcGoalDate({ currentWeightKg: p.weight_kg, goalWeightKg: p.goal_weight_kg, weeklyRateKg: -composition.totalScaleChangeKg });
    const warning = calc.deficitSafetyWarning(appliedDiff);
    const bmi = calc.calcBMI(p.weight_kg, p.height_cm);

    res.json({
      success:true, bmr, tdee, targetCalories, appliedDiff,
      targetProtein:tp, targetFat:tf, targetCarbs:tcarb, targetFiber:tfiber,
      composition, goalDate, warning,
      bmi, bmiCategory: calc.bmiCategory(bmi),
      bodyFatPct: calc.calcBodyFatEstimate({ bmi, age:p.age, gender:p.gender }),
      idealWeightKg: calc.calcIdealWeight(p.height_cm, p.gender),
      waterIntakeMl: calc.calcWaterIntake(p.weight_kg, p.activity_level),
    });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
