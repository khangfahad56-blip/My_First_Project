// Shared nutrition/fitness calculation formulas used by the server (profile targets)
// Mirrors the client-side calculator logic in public/js/calculator.js

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  heavy: 1.725,
  athlete: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose_weight: -500,
  lose_fat: -500,
  maintain: 0,
  gain_muscle: 300,
  gain_weight: 500,
};

function calcBMR({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

function calcTDEE(bmr, activityLevel) {
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  return bmr * mult;
}

function calcTargetCalories(tdee, goal) {
  const adj = GOAL_ADJUSTMENTS[goal] ?? 0;
  return Math.max(1200, tdee + adj);
}

function calcProtein(weightKg, goal) {
  // 1.6-2.2 g/kg; use higher end for muscle gain / fat loss, moderate for maintenance
  let gPerKg = 1.8;
  if (goal === "gain_muscle") gPerKg = 2.2;
  else if (goal === "lose_fat" || goal === "lose_weight") gPerKg = 2.0;
  else if (goal === "maintain") gPerKg = 1.6;
  else if (goal === "gain_weight") gPerKg = 1.8;
  return weightKg * gPerKg;
}

function calcFat(weightKg, goal) {
  // 0.6-1.0 g/kg
  let gPerKg = 0.8;
  if (goal === "lose_fat" || goal === "lose_weight") gPerKg = 0.7;
  else if (goal === "gain_muscle" || goal === "gain_weight") gPerKg = 0.9;
  return weightKg * gPerKg;
}

function calcCarbs(targetCalories, proteinG, fatG) {
  const proteinCals = proteinG * 4;
  const fatCals = fatG * 9;
  const remaining = Math.max(0, targetCalories - proteinCals - fatCals);
  return remaining / 4;
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

function calcWaterIntake(weightKg, activityLevel) {
  // Base 35ml/kg + extra for activity level
  let mlPerKg = 35;
  if (activityLevel === "heavy") mlPerKg = 40;
  else if (activityLevel === "athlete") mlPerKg = 45;
  else if (activityLevel === "light") mlPerKg = 33;
  else if (activityLevel === "sedentary") mlPerKg = 30;
  return weightKg * mlPerKg;
}

function calcWalkingCalories({ weightKg, distanceKm, durationMin }) {
  // MET-based estimate: walking ~3.5 METs moderate pace
  // calories = MET * 3.5 * weight(kg) / 200 * duration(min)
  // If duration missing, estimate from distance assuming 5km/h pace
  let minutes = durationMin;
  if (!minutes && distanceKm) {
    minutes = (distanceKm / 5) * 60; // assume 5 km/h
  }
  if (!minutes) return 0;
  const MET = 3.5;
  return (MET * 3.5 * weightKg / 200) * minutes;
}

function calcWeeklyFatLoss(dailyDeficit) {
  // 7700 kcal = 1 kg fat
  const weeklyDeficit = dailyDeficit * 7;
  return weeklyDeficit / 7700;
}

module.exports = {
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
  calcBMR,
  calcTDEE,
  calcTargetCalories,
  calcProtein,
  calcFat,
  calcCarbs,
  calcBMI,
  bmiCategory,
  calcBodyFatNavy,
  calcBodyFatEstimate,
  calcIdealWeight,
  calcWaterIntake,
  calcWalkingCalories,
  calcWeeklyFatLoss,
};
