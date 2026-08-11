const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");
const calc    = require("../utils/calculations");

const today = () => new Date().toISOString().slice(0,10);
const daysAgo = n => { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); };

function getDayTotals(date) {
  const meals = prepare("SELECT * FROM meal_logs WHERE log_date=? ORDER BY created_at ASC").all(date);
  const totals = meals.reduce((acc,m)=>({
    calories: acc.calories+m.calories, protein: acc.protein+m.protein,
    carbs: acc.carbs+m.carbs,          fat: acc.fat+m.fat,
    fiber: acc.fiber+m.fiber,          sugar: acc.sugar+m.sugar,
    sodium: acc.sodium+m.sodium,       potassium: acc.potassium+m.potassium,
  }), { calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0,potassium:0 });

  const waterRow   = prepare("SELECT SUM(amount_ml) AS total FROM water_logs WHERE log_date=?").get(date);
  const walkRow    = prepare("SELECT SUM(calories_burned) AS cals, SUM(distance_km) AS dist, SUM(steps) AS steps FROM walking_logs WHERE log_date=?").get(date);
  const weightRow  = prepare("SELECT weight_kg FROM weight_logs WHERE log_date=?").get(date);

  return {
    date, meals, totals,
    water: waterRow?.total || 0,
    walking: { calories: walkRow?.cals||0, distanceKm: walkRow?.dist||0, steps: walkRow?.steps||0 },
    weightKg: weightRow?.weight_kg ?? null,
  };
}

// GET /api/dashboard
router.get("/", (req, res) => {
  try {
    const date    = req.query.date || today();
    const profile = prepare("SELECT * FROM profile WHERE id=1").get();
    const day     = getDayTotals(date);

    let currentWeight = day.weightKg;
    if (currentWeight == null) {
      const latest = prepare("SELECT weight_kg FROM weight_logs ORDER BY log_date DESC LIMIT 1").get();
      currentWeight = latest ? latest.weight_kg : profile.weight_kg;
    }

    const bmi         = calc.calcBMI(currentWeight, profile.height_cm);
    const bodyFat     = calc.calcBodyFatEstimate({ bmi, age:profile.age, gender:profile.gender });

    // Food logging impact + walking effect on the calorie goal (project requirements #3, #5)
    const netCalories  = day.totals.calories - day.walking.calories; // "effective intake"
    const calRemaining = (profile.target_calories||0) - netCalories;
    const currentDeficit = (profile.target_calories||0) - day.totals.calories + day.walking.calories; // positive = deficit, negative = surplus
    // Recompute using the *actual* TDEE (not just the target) so "today's real deficit vs TDEE" is available too
    const bmr  = calc.calcBMR({ gender:profile.gender, weightKg:currentWeight, heightCm:profile.height_cm, age:profile.age });
    const tdee = calc.calcTDEE(bmr, profile.activity_level);
    const trueDeficitVsTDEE = tdee - netCalories;
    const expectedWeeklyChange = calc.calcBodyCompositionChange({ dailyCalorieDiff: -currentDeficit, weightKg: currentWeight, goalType: profile.goal });

    // Goal progress %
    let goalProgressPct = null;
    if (profile.goal_weight_kg && profile.weight_kg != null) {
      // Use the first logged weight as the starting point if available
      const firstWeight = prepare("SELECT weight_kg FROM weight_logs ORDER BY log_date ASC LIMIT 1").get();
      const startWeight = firstWeight ? firstWeight.weight_kg : currentWeight;
      const totalNeeded = startWeight - profile.goal_weight_kg;
      if (totalNeeded !== 0) {
        const doneSoFar = startWeight - currentWeight;
        goalProgressPct = Math.max(0, Math.min(100, (doneSoFar / totalNeeded) * 100));
      }
    }

    // Weekly progress average (last 7 days including today)
    const weekAgo = daysAgo(6);
    const weekCalRow = prepare("SELECT AVG(daily) AS avgCal FROM (SELECT log_date, SUM(calories) AS daily FROM meal_logs WHERE log_date>=? AND log_date<=? GROUP BY log_date)").get(weekAgo, date);
    const weekWalkRow = prepare("SELECT SUM(calories_burned) AS cals FROM walking_logs WHERE log_date>=? AND log_date<=?").get(weekAgo, date);
    const weeklyAvgCalories = weekCalRow?.avgCal || 0;
    const weeklyAvgDeficit = (profile.target_calories||0) - weeklyAvgCalories;

    res.json({
      success:true, date, profile, today:day,
      remaining:{
        calories: calRemaining,
        protein:  Math.max(0,(profile.target_protein||0)-day.totals.protein),
        fat:      Math.max(0,(profile.target_fat||0)-day.totals.fat),
        carbs:    Math.max(0,(profile.target_carbs||0)-day.totals.carbs),
        fiber:    Math.max(0,(profile.target_fiber||0)-day.totals.fiber),
        water:    Math.max(0,(profile.target_water_ml||0)-day.water),
      },
      impact: {
        effectiveIntake: netCalories,
        currentDeficit,          // vs personal target_calories
        trueDeficitVsTDEE,       // vs actual TDEE today
        expectedWeeklyChange,    // { totalScaleChangeKg, fatChangeKg, leanChangeKg, waterFluctuationKg }
      },
      weeklyProgress: {
        avgCaloriesConsumed: weeklyAvgCalories,
        avgDeficit: weeklyAvgDeficit,
        walkingCaloriesThisWeek: weekWalkRow?.cals || 0,
      },
      goalProgressPct,
      bmi, bmiCategory: calc.bmiCategory(bmi), bodyFatPct:bodyFat, currentWeight,
    });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// GET /api/dashboard/history?range=today|yesterday|week|month
router.get("/history", (req, res) => {
  try {
    const range = req.query.range || "week";
    const endDate   = range==="yesterday" ? daysAgo(1) : today();
    const startDate = range==="today" ? today() : range==="yesterday" ? daysAgo(1) : range==="month" ? daysAgo(29) : daysAgo(6);

    const meals   = prepare(`SELECT log_date,SUM(calories) AS calories,SUM(protein) AS protein,SUM(carbs) AS carbs,SUM(fat) AS fat,SUM(fiber) AS fiber,SUM(sugar) AS sugar FROM meal_logs WHERE log_date>=? AND log_date<=? GROUP BY log_date ORDER BY log_date ASC`).all(startDate, endDate);
    const weights = prepare(`SELECT log_date,weight_kg FROM weight_logs WHERE log_date>=? AND log_date<=? ORDER BY log_date ASC`).all(startDate, endDate);
    const walking = prepare(`SELECT log_date,SUM(calories_burned) AS calories,SUM(distance_km) AS distance,SUM(steps) AS steps FROM walking_logs WHERE log_date>=? AND log_date<=? GROUP BY log_date ORDER BY log_date ASC`).all(startDate, endDate);

    res.json({ success:true, range, startDate, endDate, meals, weights, walking });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// GET /api/dashboard/report?type=daily|weekly|monthly&date=YYYY-MM-DD
router.get("/report", (req, res) => {
  try {
    const type = req.query.type || "daily";
    const date = req.query.date || today();
    const profile = prepare("SELECT * FROM profile WHERE id=1").get();

    let startDate;
    if (type==="daily")        startDate = date;
    else if (type==="weekly")  { const d=new Date(date); d.setDate(d.getDate()-6); startDate=d.toISOString().slice(0,10); }
    else                       { const d=new Date(date); d.setDate(d.getDate()-29); startDate=d.toISOString().slice(0,10); }

    const meals = prepare("SELECT * FROM meal_logs WHERE log_date>=? AND log_date<=? ORDER BY log_date ASC,created_at ASC").all(startDate, date);
    const totals = meals.reduce((acc,m)=>({ calories:acc.calories+m.calories,protein:acc.protein+m.protein,carbs:acc.carbs+m.carbs,fat:acc.fat+m.fat,fiber:acc.fiber+m.fiber,sugar:acc.sugar+m.sugar,sodium:acc.sodium+m.sodium,potassium:acc.potassium+m.potassium }),{ calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0,potassium:0 });

    const numDays = Math.max(1,(new Date(date)-new Date(startDate))/(1000*60*60*24)+1);
    const waterRow  = prepare("SELECT SUM(amount_ml) AS total FROM water_logs WHERE log_date>=? AND log_date<=?").get(startDate,date);
    const walkRow   = prepare("SELECT SUM(calories_burned) AS cals,SUM(distance_km) AS dist,SUM(steps) AS steps FROM walking_logs WHERE log_date>=? AND log_date<=?").get(startDate,date);

    res.json({
      success:true, type, startDate, endDate:date, numDays, totals,
      averages:{ calories:totals.calories/numDays,protein:totals.protein/numDays,carbs:totals.carbs/numDays,fat:totals.fat/numDays },
      water: waterRow?.total||0,
      walking:{ calories:walkRow?.cals||0, distanceKm:walkRow?.dist||0, steps:walkRow?.steps||0 },
      profile, meals,
    });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
