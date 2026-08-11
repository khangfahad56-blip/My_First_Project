// Shared nutrition/fitness calculation formulas used by the server (profile targets)
// Mirrors the client-side calculator logic in public/js/calculator.js
//
// Formula references (documented per project requirement #9):
//  - BMR:              Mifflin-St Jeor equation
//  - TDEE:              BMR x activity multiplier (Harris-Benedict style activity factors)
//  - BMI:               weight(kg) / height(m)^2 (WHO)
//  - Body fat %:        Deurenberg et al. (1991) BMI-based formula; US Navy tape-measure formula as an alternative
//  - Ideal weight:      Devine formula
//  - Fat loss:          7700 kcal ~= 1 kg of fat tissue (~80/20 fat/lean approximation)
//  - Walking calories:  MET (Metabolic Equivalent of Task) formula - kcal = MET x 3.5 x weight(kg) / 200 x minutes
//  - Water intake:      35 ml/kg baseline (adjusted for activity/climate), ~12ml/kg/hr of extra activity

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  heavy: 1.725,
  athlete: 1.9,
};

// Legacy 5-option goal map (kept for backward compatibility with existing saved profiles)
const GOAL_ADJUSTMENTS = {
  lose_weight: -500,
  lose_fat: -500,
  maintain: 0,
  gain_muscle: 300,
  gain_weight: 500,
};

// New goal-type taxonomy (project requirement #1)
const GOAL_TYPES = {
  fat_loss:    { label: "Fat Loss",    defaultDiff: -500, direction: -1 },
  weight_loss: { label: "Weight Loss", defaultDiff: -500, direction: -1 },
  maintenance: { label: "Maintenance", defaultDiff: 0,    direction: 0 },
  lean_bulk:   { label: "Lean Bulk",   defaultDiff: 250,  direction: 1 },
  muscle_gain: { label: "Muscle Gain", defaultDiff: 400,  direction: 1 },
};

// Map old single-word goal values to the new taxonomy so existing data keeps working
const LEGACY_GOAL_MAP = {
  lose_weight: "weight_loss",
  lose_fat: "fat_loss",
  maintain: "maintenance",
  gain_muscle: "muscle_gain",
  gain_weight: "lean_bulk",
};

function normalizeGoalType(goal) {
  if (GOAL_TYPES[goal]) return goal;
  if (LEGACY_GOAL_MAP[goal]) return LEGACY_GOAL_MAP[goal];
  return "maintenance";
}

const SAFE_DEFICIT_MIN = 200;   // below this, not much of a real deficit
const SAFE_DEFICIT_MAX = 1000;  // above this, generally considered unsafe/unsustainable for most people
const SAFE_SURPLUS_MAX = 750;

function calcBMR({ gender, weightKg, heightCm, age }) {
  // Mifflin-St Jeor
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

function calcTDEE(bmr, activityLevel) {
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  return bmr * mult;
}

// Backward-compatible simple target calorie calc (5-option goal)
function calcTargetCalories(tdee, goal) {
  const adj = GOAL_ADJUSTMENTS[goal] ?? 0;
  return Math.max(1200, tdee + adj);
}

// Advanced target calorie calc: goalType + explicit/custom calorie difference (project requirement #1)
// calorieDiff: signed number of kcal/day to add (positive) or subtract (negative) from TDEE.
//              If null/undefined, falls back to the goal type's sensible default.
function calcTargetCaloriesAdvanced({ tdee, goalType, calorieDiff }) {
  const gt = GOAL_TYPES[normalizeGoalType(goalType)];
  let diff = calorieDiff;
  if (diff === null || diff === undefined || diff === "") diff = gt.defaultDiff;
  diff = Number(diff) || 0;
  const targetCalories = Math.max(1000, tdee + diff);
  return { targetCalories, appliedDiff: targetCalories - tdee };
}

function deficitSafetyWarning(dailyDeficit) {
  // dailyDeficit: positive = calorie deficit, negative = surplus
  if (dailyDeficit > SAFE_DEFICIT_MAX) {
    return `A deficit above ${SAFE_DEFICIT_MAX} kcal/day is aggressive and may be unsafe - it can cause muscle loss, fatigue, and nutrient shortfalls. Consider a smaller deficit or medical supervision.`;
  }
  if (dailyDeficit > 0 && dailyDeficit < SAFE_DEFICIT_MIN) {
    return `A deficit under ${SAFE_DEFICIT_MIN} kcal/day will produce very slow results - day-to-day fluctuations may hide any progress.`;
  }
  if (dailyDeficit < -SAFE_SURPLUS_MAX) {
    return `A surplus above ${SAFE_SURPLUS_MAX} kcal/day usually leads to more fat gain than muscle gain. Consider a smaller surplus for a leaner bulk.`;
  }
  return null;
}

function calcProtein(weightKg, goal) {
  // 1.6-2.2 g/kg; use higher end for muscle gain / fat loss, moderate for maintenance
  const gt = normalizeGoalType(goal);
  let gPerKg = 1.8;
  if (gt === "muscle_gain") gPerKg = 2.2;
  else if (gt === "fat_loss" || gt === "weight_loss") gPerKg = 2.0;
  else if (gt === "maintenance") gPerKg = 1.6;
  else if (gt === "lean_bulk") gPerKg = 1.9;
  return weightKg * gPerKg;
}

function calcFat(weightKg, goal) {
  // 0.6-1.0 g/kg
  const gt = normalizeGoalType(goal);
  let gPerKg = 0.8;
  if (gt === "fat_loss" || gt === "weight_loss") gPerKg = 0.7;
  else if (gt === "muscle_gain" || gt === "lean_bulk") gPerKg = 0.9;
  return weightKg * gPerKg;
}

function calcCarbs(targetCalories, proteinG, fatG) {
  const proteinCals = proteinG * 4;
  const fatCals = fatG * 9;
  const remaining = Math.max(0, targetCalories - proteinCals - fatCals);
  return remaining / 4;
}

function calcFiber(targetCalories) {
  // Standard guidance: ~14g fiber per 1000 kcal
  return (targetCalories / 1000) * 14;
}

function calcBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calcBodyFatNavy({ gender, heightCm, neckCm, waistCm, hipCm }) {
  // US Navy method
  if (gender === "female") {
    if (!hipCm) return null;
    return (
      495 /
        (1.29579 -
          0.35004 * Math.log10(waistCm + hipCm - neckCm) +
          0.221 * Math.log10(heightCm)) -
      450
    );
  }
  return (
    495 /
      (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) -
    450
  );
}

function calcBodyFatEstimate({ bmi, age, gender }) {
  // Deurenberg formula (BMI-based estimate, used when tape measurements unavailable)
  const genderFactor = gender === "female" ? 0 : 1;
  return 1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
}

function calcIdealWeight(heightCm, gender) {
  // Devine formula
  const heightIn = heightCm / 2.54;
  const inchesOver5ft = Math.max(0, heightIn - 60);
  const base = gender === "female" ? 45.5 : 50;
  return base + 2.3 * inchesOver5ft;
}

// --- Water intake (project requirement #6) ----------------------------------
// Base: 35 ml/kg body weight/day (adjusted slightly by baseline activity level)
// Exercise addition: ~12 ml per kg body weight per hour of extra activity
// Hot weather addition: flat +500/+750ml for hot climates (typical sports-medicine guidance)
function calcWaterIntakeAdvanced({ weightKg, weather = "normal", activityLevel = "moderate", walkingMin = 0, workoutMin = 0 }) {
  let mlPerKg = 35;
  if (activityLevel === "heavy") mlPerKg = 40;
  else if (activityLevel === "athlete") mlPerKg = 45;
  else if (activityLevel === "light") mlPerKg = 33;
  else if (activityLevel === "sedentary") mlPerKg = 30;

  const base = weightKg * mlPerKg;
  const exerciseMinutes = (Number(walkingMin) || 0) + (Number(workoutMin) || 0);
  const exerciseMl = (exerciseMinutes / 60) * 12 * weightKg;

  let hotWeatherMl = 0;
  if (weather === "hot") hotWeatherMl = 500;
  else if (weather === "very_hot") hotWeatherMl = 750;

  const total = base + exerciseMl + hotWeatherMl;
  return {
    base: Math.round(base),
    exercise: Math.round(exerciseMl),
    hotWeather: Math.round(hotWeatherMl),
    total: Math.round(total),
  };
}

function calcWaterIntake(weightKg, activityLevel) {
  // Backward-compatible simple version (kept for profile defaults)
  return calcWaterIntakeAdvanced({ weightKg, activityLevel }).total;
}

// --- Walking calculator (project requirement #4) ----------------------------
// MET values by walking type (Compendium of Physical Activities style estimates)
const WALK_TYPE_MET = {
  normal: 3.0,             // ~4-5 km/h casual pace
  brisk: 4.3,               // ~5.5-6.5 km/h brisk pace
  power_walk: 6.3,          // ~7 km/h vigorous pace with arm drive
  weighted_backpack: 5.0,   // moderate pace carrying extra load
};

const TERRAIN_MULTIPLIER = {
  flat: 1.0,
  slight_incline: 1.2,
  steep_incline: 1.5,
  trail: 1.15,
  treadmill: 1.0,
};

// Speed-based MET refinement: faster speed = higher MET, using standard walking-speed brackets.
function speedMET(speedKmh) {
  if (speedKmh <= 0) return 2.5;
  if (speedKmh < 3.2) return 2.5;
  if (speedKmh < 4.0) return 2.8;
  if (speedKmh < 4.8) return 3.0;
  if (speedKmh < 5.6) return 3.5;
  if (speedKmh < 6.4) return 4.3;
  if (speedKmh < 7.2) return 5.0;
  return 6.3;
}

/**
 * Advanced walking calorie calculator.
 * Accepts any combination of speed / duration / distance and derives the rest.
 */
function calcWalkingCaloriesAdvanced({ weightKg, speedKmh, durationMin, distanceKm, terrain = "flat", walkType = "normal" }) {
  weightKg = Number(weightKg) || 70;
  speedKmh = Number(speedKmh) || 0;
  durationMin = Number(durationMin) || 0;
  distanceKm = Number(distanceKm) || 0;

  // Derive the missing value among speed/duration/distance from the two given
  if (speedKmh && durationMin && !distanceKm) {
    distanceKm = (speedKmh * durationMin) / 60;
  } else if (speedKmh && distanceKm && !durationMin) {
    durationMin = (distanceKm / speedKmh) * 60;
  } else if (distanceKm && durationMin && !speedKmh) {
    speedKmh = distanceKm / (durationMin / 60);
  } else if (distanceKm && !durationMin && !speedKmh) {
    speedKmh = 5; // assume average walking pace
    durationMin = (distanceKm / speedKmh) * 60;
  } else if (durationMin && !distanceKm && !speedKmh) {
    speedKmh = 5;
    distanceKm = (speedKmh * durationMin) / 60;
  }

  if (!durationMin) {
    return { caloriesBurned: 0, avgPace: 0, distanceKm: 0, durationMin: 0, avgSpeedKmh: 0, met: 0 };
  }

  // Blend the walk-type MET with the speed-derived MET, then apply terrain multiplier
  const typeMET = WALK_TYPE_MET[walkType] || WALK_TYPE_MET.normal;
  const bySpeed = speedMET(speedKmh);
  const baseMET = Math.max(typeMET, bySpeed);
  const terrainMult = TERRAIN_MULTIPLIER[terrain] ?? 1.0;
  const met = baseMET * terrainMult;

  const caloriesBurned = (met * 3.5 * weightKg / 200) * durationMin;
  const avgPace = distanceKm > 0 ? durationMin / distanceKm : 0; // min per km

  return {
    caloriesBurned: Math.round(caloriesBurned * 10) / 10,
    avgPace: Math.round(avgPace * 100) / 100,
    distanceKm: Math.round(distanceKm * 100) / 100,
    durationMin: Math.round(durationMin * 10) / 10,
    avgSpeedKmh: Math.round(speedKmh * 100) / 100,
    met: Math.round(met * 100) / 100,
  };
}

// Backward-compatible simple version (used by legacy calls with just distance/duration)
function calcWalkingCalories({ weightKg, distanceKm, durationMin }) {
  return calcWalkingCaloriesAdvanced({ weightKg, distanceKm, durationMin }).caloriesBurned;
}

// --- Fat loss / weight loss estimation (project requirements #1, #2) --------
const KCAL_PER_KG_FAT = 7700;

function calcWeeklyFatLoss(dailyDeficit) {
  // 7700 kcal ~= 1 kg fat
  const weeklyDeficit = dailyDeficit * 7;
  return weeklyDeficit / 7700;
}

/**
 * Splits an expected weekly scale-weight change into components. This is a
 * widely-used *approximation*, not a precise metabolic model:
 *  - In a deficit, ~80% of lost scale weight is fat, ~20% is lean mass
 *    (varies with protein intake & resistance training).
 *  - In a surplus, only a fraction of the weight gained can be muscle at a
 *    natural rate (~0.25 kg/week ceiling); the rest is counted as fat.
 *  - Water/glycogen weight is a short-term fluctuation that moves independently
 *    based on carbs, sodium, hydration and hormones - shown separately.
 */
function calcBodyCompositionChange({ dailyCalorieDiff, weightKg, goalType }) {
  const weeklyDiff = dailyCalorieDiff * 7; // kcal, negative = deficit
  const totalScaleChangeKg = weeklyDiff / KCAL_PER_KG_FAT; // signed

  let fatChangeKg, leanChangeKg;
  if (weeklyDiff < 0) {
    fatChangeKg = totalScaleChangeKg * 0.80;
    leanChangeKg = totalScaleChangeKg * 0.20;
  } else if (weeklyDiff > 0) {
    const maxMuscleGainKg = 0.25; // natural weekly ceiling
    leanChangeKg = Math.min(totalScaleChangeKg * 0.4, maxMuscleGainKg);
    fatChangeKg = totalScaleChangeKg - leanChangeKg;
  } else {
    fatChangeKg = 0;
    leanChangeKg = 0;
  }

  const waterFluctuationKg = Math.abs(totalScaleChangeKg) * 0.05 * (weeklyDiff < 0 ? -1 : 1);

  return {
    totalScaleChangeKg: Math.round(totalScaleChangeKg * 1000) / 1000,
    fatChangeKg: Math.round(fatChangeKg * 1000) / 1000,
    leanChangeKg: Math.round(leanChangeKg * 1000) / 1000,
    waterFluctuationKg: Math.round(waterFluctuationKg * 1000) / 1000,
  };
}

/**
 * Estimates the calendar date the user will hit their goal weight, given a
 * steady weekly rate of scale-weight change. Returns null if the rate can't
 * make progress toward the goal.
 */
function calcGoalDate({ currentWeightKg, goalWeightKg, weeklyRateKg }) {
  if (!goalWeightKg || !weeklyRateKg || weeklyRateKg === 0) return null;
  const remaining = goalWeightKg - currentWeightKg; // signed
  if (Math.sign(remaining) !== Math.sign(weeklyRateKg)) return null;
  const weeksNeeded = Math.abs(remaining / weeklyRateKg);
  const d = new Date();
  d.setDate(d.getDate() + Math.round(weeksNeeded * 7));
  return d.toISOString().slice(0, 10);
}

module.exports = {
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
  GOAL_TYPES,
  normalizeGoalType,
  SAFE_DEFICIT_MIN,
  SAFE_DEFICIT_MAX,
  SAFE_SURPLUS_MAX,
  calcBMR,
  calcTDEE,
  calcTargetCalories,
  calcTargetCaloriesAdvanced,
  deficitSafetyWarning,
  calcProtein,
  calcFat,
  calcCarbs,
  calcFiber,
  calcBMI,
  bmiCategory,
  calcBodyFatNavy,
  calcBodyFatEstimate,
  calcIdealWeight,
  calcWaterIntake,
  calcWaterIntakeAdvanced,
  calcWalkingCalories,
  calcWalkingCaloriesAdvanced,
  calcWeeklyFatLoss,
  calcBodyCompositionChange,
  calcGoalDate,
  KCAL_PER_KG_FAT,
};
