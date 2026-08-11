// Calculator page: advanced calorie goal planner + water intake calculator.
// Formulas mirror utils/calculations.js on the server so results match exactly what gets saved.
const Calculator = (() => {
  const ACTIVITY_MULT = { sedentary: 1.2, light: 1.375, moderate: 1.55, heavy: 1.725, athlete: 1.9 };

  const GOAL_TYPES = {
    fat_loss:    { label: "Fat Loss",    defaultDiff: -500, direction: -1 },
    weight_loss: { label: "Weight Loss", defaultDiff: -500, direction: -1 },
    maintenance: { label: "Maintenance", defaultDiff: 0,    direction: 0 },
    lean_bulk:   { label: "Lean Bulk",   defaultDiff: 250,  direction: 1 },
    muscle_gain: { label: "Muscle Gain", defaultDiff: 400,  direction: 1 },
  };
  const LEGACY_GOAL_MAP = {
    lose_weight: "weight_loss", lose_fat: "fat_loss", maintain: "maintenance",
    gain_muscle: "muscle_gain", gain_weight: "lean_bulk",
  };
  function normalizeGoal(goal) {
    if (GOAL_TYPES[goal]) return goal;
    if (LEGACY_GOAL_MAP[goal]) return LEGACY_GOAL_MAP[goal];
    return "maintenance";
  }

  const DEFICIT_PRESETS = [250, 300, 400, 500, 750, 1000];
  const SURPLUS_PRESETS = [150, 250, 350, 500];

  function bmr({ gender, weightKg, heightCm, age }) {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return gender === "female" ? base - 161 : base + 5;
  }
  function tdee(bmrVal, activity) { return bmrVal * (ACTIVITY_MULT[activity] || 1.55); }
  function targetCaloriesAdvanced(tdeeVal, goal, calorieDiff) {
    const gt = GOAL_TYPES[normalizeGoal(goal)];
    let diff = calorieDiff === null || calorieDiff === undefined || calorieDiff === "" ? gt.defaultDiff : Number(calorieDiff);
    const targetCalories = Math.max(1000, tdeeVal + diff);
    return { targetCalories, appliedDiff: targetCalories - tdeeVal };
  }
  function protein(weightKg, goal) {
    const gt = normalizeGoal(goal);
    let g = 1.8;
    if (gt === "muscle_gain") g = 2.2;
    else if (gt === "fat_loss" || gt === "weight_loss") g = 2.0;
    else if (gt === "maintenance") g = 1.6;
    else if (gt === "lean_bulk") g = 1.9;
    return weightKg * g;
  }
  function fat(weightKg, goal) {
    const gt = normalizeGoal(goal);
    let g = 0.8;
    if (gt === "fat_loss" || gt === "weight_loss") g = 0.7;
    else if (gt === "muscle_gain" || gt === "lean_bulk") g = 0.9;
    return weightKg * g;
  }
  function carbs(cals, proteinG, fatG) {
    const remaining = Math.max(0, cals - proteinG * 4 - fatG * 9);
    return remaining / 4;
  }
  function fiberTarget(cals) { return (cals / 1000) * 14; }
  function bmi(weightKg, heightCm) { const m = heightCm / 100; return weightKg / (m * m); }
  function bmiCategory(v) {
    if (v < 18.5) return { label: "Underweight", color: "text-sky-500" };
    if (v < 25) return { label: "Normal", color: "text-leaf-500" };
    if (v < 30) return { label: "Overweight", color: "text-saffron-500" };
    return { label: "Obese", color: "text-red-500" };
  }
  function bodyFatEstimate({ bmiVal, age, gender }) {
    return 1.2 * bmiVal + 0.23 * age - 10.8 * (gender === "female" ? 0 : 1) - 5.4;
  }
  function idealWeight(heightCm, gender) {
    const heightIn = heightCm / 2.54;
    const over = Math.max(0, heightIn - 60);
    return (gender === "female" ? 45.5 : 50) + 2.3 * over;
  }
  function waterIntakeAdvanced({ weightKg, weather, activity, walkingMin, workoutMin }) {
    let mlPerKg = 35;
    if (activity === "heavy") mlPerKg = 40;
    else if (activity === "athlete") mlPerKg = 45;
    else if (activity === "light") mlPerKg = 33;
    else if (activity === "sedentary") mlPerKg = 30;
    const base = weightKg * mlPerKg;
    const exerciseMinutes = (Number(walkingMin) || 0) + (Number(workoutMin) || 0);
    const exercise = (exerciseMinutes / 60) * 12 * weightKg;
    let hotWeather = 0;
    if (weather === "hot") hotWeather = 500;
    else if (weather === "very_hot") hotWeather = 750;
    return { base: Math.round(base), exercise: Math.round(exercise), hotWeather: Math.round(hotWeather), total: Math.round(base + exercise + hotWeather) };
  }
  const KCAL_PER_KG_FAT = 7700;
  function bodyComposition({ dailyCalorieDiff, goal }) {
    // dailyCalorieDiff here: positive = surplus, negative = deficit (i.e. -appliedDiff... see caller)
    const weeklyDiff = dailyCalorieDiff * 7;
    const totalScaleChangeKg = weeklyDiff / KCAL_PER_KG_FAT;
    let fatChangeKg, leanChangeKg;
    if (weeklyDiff < 0) {
      fatChangeKg = totalScaleChangeKg * 0.80;
      leanChangeKg = totalScaleChangeKg * 0.20;
    } else if (weeklyDiff > 0) {
      const maxMuscleGainKg = 0.25;
      leanChangeKg = Math.min(totalScaleChangeKg * 0.4, maxMuscleGainKg);
      fatChangeKg = totalScaleChangeKg - leanChangeKg;
    } else { fatChangeKg = 0; leanChangeKg = 0; }
    const waterFluctuationKg = Math.abs(totalScaleChangeKg) * 0.05 * (weeklyDiff < 0 ? -1 : 1);
    return { totalScaleChangeKg, fatChangeKg, leanChangeKg, waterFluctuationKg };
  }
  function goalDate({ currentWeightKg, goalWeightKg, weeklyRateKg }) {
    if (!goalWeightKg || !weeklyRateKg) return null;
    const remaining = goalWeightKg - currentWeightKg;
    if (Math.sign(remaining) !== Math.sign(weeklyRateKg)) return null;
    const weeksNeeded = Math.abs(remaining / weeklyRateKg);
    const d = new Date();
    d.setDate(d.getDate() + Math.round(weeksNeeded * 7));
    return d;
  }
  function deficitWarning(dailyDeficit) {
    if (dailyDeficit > 1000) return { level: "danger", text: "This deficit is aggressive and may be unsafe — it can cause muscle loss, fatigue, and nutrient shortfalls. Consider a smaller deficit or medical supervision." };
    if (dailyDeficit > 0 && dailyDeficit < 200) return { level: "info", text: "This deficit is quite small — day-to-day fluctuations may hide progress on the scale." };
    if (dailyDeficit < -750) return { level: "danger", text: "This surplus usually leads to more fat gain than muscle gain. Consider a smaller surplus for a leaner bulk." };
    return null;
  }

  function render() {
    const el = document.getElementById("section-calculator");
    const p = AppState.profile || {};
    const goal = normalizeGoal(p.goal || "maintenance");
    el.innerHTML = `
      <div class="animate-in">
        <div class="mb-6">
          <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Calculator</h2>
          <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">Plan your calorie goal, see your fat-loss timeline, and work out your daily water target.</p>
        </div>

        <div class="grid lg:grid-cols-5 gap-6">
          <!-- Input Panel -->
          <div class="lg:col-span-2 card p-5 sm:p-6 h-fit">
            <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Your Details</h3>
            <div class="space-y-4">
              <div>
                <label class="form-label">Gender</label>
                <div class="grid grid-cols-2 gap-2">
                  <div class="seg-btn" data-field="gender" data-value="male">Male</div>
                  <div class="seg-btn" data-field="gender" data-value="female">Female</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="form-label">Age</label>
                  <input type="number" id="calc-age" class="input-field" value="${p.age || 25}" min="1" max="120" />
                </div>
                <div>
                  <label class="form-label">Current Weight (kg)</label>
                  <input type="number" id="calc-weight" class="input-field" value="${p.weight_kg || 70}" min="1" max="500" step="0.1" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="form-label">Height (cm)</label>
                  <input type="number" id="calc-height" class="input-field" value="${p.height_cm || 170}" min="50" max="250" step="0.5" />
                </div>
                <div>
                  <label class="form-label">Goal Weight (kg)</label>
                  <input type="number" id="calc-goal-weight" class="input-field" value="${p.goal_weight_kg || p.weight_kg || 70}" min="1" max="500" step="0.1" />
                </div>
              </div>
              <div>
                <label class="form-label">Activity Level</label>
                <select id="calc-activity" class="input-field">
                  <option value="sedentary">Sedentary (little/no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="heavy">Heavy (6-7 days/week)</option>
                  <option value="athlete">Athlete (2x/day)</option>
                </select>
              </div>
              <div>
                <label class="form-label">Goal Type</label>
                <select id="calc-goal" class="input-field">
                  <option value="fat_loss">Fat Loss</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="lean_bulk">Lean Bulk</option>
                  <option value="muscle_gain">Muscle Gain</option>
                </select>
              </div>

              <div id="calc-diff-wrap">
                <label class="form-label">Daily Calorie Difference</label>
                <div id="calc-diff-presets" class="flex flex-wrap gap-1.5 mb-2"></div>
                <div class="flex items-center gap-2">
                  <input type="number" id="calc-diff-custom" class="input-field" placeholder="Custom kcal/day" step="10" />
                  <span class="text-xs text-sapphire-400 shrink-0">kcal/day</span>
                </div>
              </div>

              <div id="calc-warning" class="hidden"></div>

              <button id="calc-save-btn" class="btn-primary w-full mt-2">Calculate &amp; Save Profile</button>
            </div>
          </div>

          <!-- Results Panel -->
          <div class="lg:col-span-3 space-y-4" id="calc-results"></div>
        </div>

        <!-- Water Intake Calculator (project requirement #6) -->
        <div class="card p-5 sm:p-6 mt-6">
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-1">Water Intake Calculator</h3>
          <p class="text-xs text-sapphire-400 dark:text-sapphire-300 mb-4">Estimates how much water you should drink today, based on your weight, the weather, and how active you are.</p>
          <div class="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="form-label">Weather</label>
              <select id="water-weather" class="input-field">
                <option value="normal">Normal</option>
                <option value="hot">Hot</option>
                <option value="very_hot">Very Hot</option>
              </select>
            </div>
            <div>
              <label class="form-label">Walking Duration (min)</label>
              <input type="number" id="water-walk-min" class="input-field" placeholder="e.g. 30" min="0" step="1" value="0" />
            </div>
            <div>
              <label class="form-label">Workout Duration (min)</label>
              <input type="number" id="water-workout-min" class="input-field" placeholder="e.g. 45" min="0" step="1" value="0" />
            </div>
          </div>
          <div id="water-results" class="grid sm:grid-cols-4 gap-4"></div>
        </div>
      </div>
    `;

    // Build calorie-diff preset chips
    buildDiffPresets(goal, p.calorie_diff);

    el.querySelector("#calc-activity").value = p.activity_level || "moderate";
    el.querySelector("#calc-goal").value = goal;
    setGenderSeg(p.gender || "male");

    el.querySelectorAll('[data-field="gender"]').forEach((btn) => {
      btn.addEventListener("click", () => setGenderSeg(btn.dataset.value));
    });

    el.querySelector("#calc-goal").addEventListener("change", (e) => {
      buildDiffPresets(e.target.value, null);
      computeAndDisplay();
    });

    el.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("input", computeAndDisplay);
    });

    el.querySelector("#calc-save-btn").addEventListener("click", saveProfile);

    computeAndDisplay();
    computeWater();
  }

  function buildDiffPresets(goal, currentDiff) {
    const gt = GOAL_TYPES[normalizeGoal(goal)];
    const wrap = document.getElementById("calc-diff-presets");
    const customInput = document.getElementById("calc-diff-custom");
    if (!wrap) return;

    if (gt.direction === 0) {
      wrap.innerHTML = `<p class="text-[11px] text-sapphire-400">Maintenance uses your TDEE directly — no deficit or surplus needed.</p>`;
      customInput.value = "";
      customInput.placeholder = "0 (maintenance)";
      customInput.disabled = true;
      return;
    }
    customInput.disabled = false;
    const presets = gt.direction < 0 ? DEFICIT_PRESETS : SURPLUS_PRESETS;
    const signedDefault = gt.direction < 0 ? -Math.abs(gt.defaultDiff) : Math.abs(gt.defaultDiff);
    wrap.innerHTML = presets.map((v) => {
      const signed = gt.direction < 0 ? -v : v;
      const isActive = currentDiff != null ? Number(currentDiff) === signed : signed === signedDefault;
      return `<button type="button" class="chip diff-preset-btn ${isActive ? "chip-active" : ""}" data-diff="${signed}">${gt.direction < 0 ? "-" : "+"}${v} kcal</button>`;
    }).join("");
    wrap.querySelectorAll(".diff-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        customInput.value = btn.dataset.diff;
        wrap.querySelectorAll(".diff-preset-btn").forEach((b) => b.classList.remove("chip-active"));
        btn.classList.add("chip-active");
        computeAndDisplay();
      });
    });
    if (currentDiff != null && !presets.includes(Math.abs(Number(currentDiff)))) {
      customInput.value = currentDiff;
    }
  }

  function setGenderSeg(value) {
    document.querySelectorAll('[data-field="gender"]').forEach((b) => {
      b.classList.toggle("active", b.dataset.value === value);
    });
    computeAndDisplay();
  }

  function getGender() {
    const active = document.querySelector('[data-field="gender"].active');
    return active ? active.dataset.value : "male";
  }

  function readInputs() {
    return {
      gender: getGender(),
      age: parseFloat(document.getElementById("calc-age").value) || 25,
      weightKg: parseFloat(document.getElementById("calc-weight").value) || 70,
      goalWeightKg: parseFloat(document.getElementById("calc-goal-weight").value) || 70,
      heightCm: parseFloat(document.getElementById("calc-height").value) || 170,
      activity: document.getElementById("calc-activity").value,
      goal: document.getElementById("calc-goal").value,
      diffRaw: document.getElementById("calc-diff-custom").value,
    };
  }

  function computeAndDisplay() {
    const { gender, age, weightKg, goalWeightKg, heightCm, activity, goal, diffRaw } = readInputs();
    const gt = GOAL_TYPES[normalizeGoal(goal)];
    const calorieDiff = gt.direction === 0 ? 0 : (diffRaw === "" ? null : parseFloat(diffRaw));

    const bmrVal = bmr({ gender, weightKg, heightCm, age });
    const tdeeVal = tdee(bmrVal, activity);
    const { targetCalories: targetCals, appliedDiff } = targetCaloriesAdvanced(tdeeVal, goal, calorieDiff);
    const proteinVal = protein(weightKg, goal);
    const fatVal = fat(weightKg, goal);
    const carbsVal = carbs(targetCals, proteinVal, fatVal);
    const fiberVal = fiberTarget(targetCals);
    const bmiVal = bmi(weightKg, heightCm);
    const bmiCat = bmiCategory(bmiVal);
    const bodyFatVal = bodyFatEstimate({ bmiVal, age, gender });
    const idealW = idealWeight(heightCm, gender);

    // appliedDiff: positive = surplus, negative = deficit (target - tdee)
    const composition = bodyComposition({ dailyCalorieDiff: appliedDiff, goal });
    const rateKg = -composition.totalScaleChangeKg; // signed weekly rate toward the goal (negative when losing)
    const gDate = goalDate({ currentWeightKg: weightKg, goalWeightKg, weeklyRateKg: rateKg });
    const warning = deficitWarning(-appliedDiff); // convert to "deficit positive" convention for the warning text

    const warnEl = document.getElementById("calc-warning");
    if (warning) {
      warnEl.classList.remove("hidden");
      warnEl.innerHTML = `<div class="rounded-xl px-3 py-2.5 text-xs font-medium ${warning.level === "danger" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-saffron-500/10 text-saffron-700 dark:text-saffron-300"}">${warning.text}</div>`;
    } else {
      warnEl.classList.add("hidden");
      warnEl.innerHTML = "";
    }

    const results = document.getElementById("calc-results");
    const isDeficit = appliedDiff < 0;
    const isSurplus = appliedDiff > 0;
    const dailyDiffLabel = isDeficit ? "Daily Deficit" : isSurplus ? "Daily Surplus" : "Daily Balance";

    results.innerHTML = `
      <div class="grid sm:grid-cols-3 gap-4">
        ${resultCard("fire", "BMR", `${fmt(bmrVal)}`, "kcal/day", "Calories burned at rest")}
        ${resultCard("dashboard", "TDEE", `${fmt(tdeeVal)}`, "kcal/day", "Total daily energy expenditure")}
        ${resultCard("tracker", "Target Calories", `${fmt(targetCals)}`, "kcal/day", `For ${gt.label}`)}
      </div>

      <div class="card p-5 sm:p-6">
        <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Daily Macros</h3>
        <div class="grid sm:grid-cols-4 gap-4">
          ${macroMini("Protein", proteinVal, "g", "bg-sky-500")}
          ${macroMini("Fat", fatVal, "g", "bg-saffron-500")}
          ${macroMini("Carbohydrates", carbsVal, "g", "bg-leaf-500")}
          ${macroMini("Fiber", fiberVal, "g", "bg-sapphire-500")}
        </div>
      </div>

      <!-- Weekly Weight Loss Prediction -->
      <div class="card p-5 sm:p-6">
        <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Weekly Weight ${isDeficit ? "Loss" : isSurplus ? "Gain" : "Change"} Prediction</h3>
        <div class="grid sm:grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">${dailyDiffLabel}</p>
            <p class="stat-number text-xl font-700 text-sapphire-800 dark:text-white">${fmt(Math.abs(appliedDiff))}</p>
            <p class="text-[10px] text-sapphire-400">kcal</p>
          </div>
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Expected / Week</p>
            <p class="stat-number text-xl font-700 text-sapphire-800 dark:text-white">${fmt(Math.abs(composition.totalScaleChangeKg), 2)} kg</p>
          </div>
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Expected / Month</p>
            <p class="stat-number text-xl font-700 text-sapphire-800 dark:text-white">${fmt(Math.abs(composition.totalScaleChangeKg) * 4.345, 2)} kg</p>
          </div>
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Estimated Goal Date</p>
            <p class="stat-number text-base font-700 text-sapphire-800 dark:text-white">${gDate ? gDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "—"}</p>
          </div>
        </div>
      </div>

      <!-- Fat vs Water vs Lean Mass breakdown (project requirement #2) -->
      <div class="card p-5 sm:p-6">
        <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-1">What Makes Up That Scale Change?</h3>
        <p class="text-xs text-sapphire-400 dark:text-sapphire-300 mb-4">Body weight isn't just fat — it's fat, water, glycogen, muscle, and even food still in your digestive system. The scale lumps all of that together, so it rarely moves in a straight line even when fat loss is on track.</p>
        <div class="grid sm:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-[11px] text-sapphire-400 mb-1">Estimated Fat Change</p>
            <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(composition.fatChangeKg)} kg</p>
          </div>
          <div class="text-center">
            <p class="text-[11px] text-sapphire-400 mb-1">Estimated Lean Mass Change</p>
            <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(composition.leanChangeKg)} kg</p>
          </div>
          <div class="text-center">
            <p class="text-[11px] text-sapphire-400 mb-1">Estimated Water Fluctuation</p>
            <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(composition.waterFluctuationKg)} kg</p>
          </div>
          <div class="text-center">
            <p class="text-[11px] text-sapphire-400 mb-1">Total Scale Change</p>
            <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(composition.totalScaleChangeKg)} kg</p>
          </div>
        </div>
        <p class="text-[11px] text-sapphire-400 dark:text-sapphire-500 mt-4 pt-4 border-t border-sapphire-100 dark:border-white/10">Note: this is an approximation (~80% fat / 20% lean mass while cutting, capped natural muscle gain while bulking). Actual results vary with protein intake, training, sleep, sodium, and hormones — use trends over weeks, not single days.</p>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="card p-5">
          <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-1">BMI</p>
          <div class="flex items-end gap-2">
            <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(bmiVal, 1)}</span>
            <span class="text-sm font-semibold mb-1 ${bmiCat.color}">${bmiCat.label}</span>
          </div>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-1">Estimated Body Fat %</p>
          <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(bodyFatVal, 1)}%</span>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-1">Ideal Weight</p>
          <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(idealW, 1)} kg</span>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-1">Goal Weight</p>
          <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(goalWeightKg, 1)} kg</span>
        </div>
      </div>
    `;
  }

  function computeWater() {
    const results = document.getElementById("water-results");
    if (!results) return;
    const p = AppState.profile || {};
    const weightKg = parseFloat(document.getElementById("calc-weight")?.value) || p.weight_kg || 70;
    const activity = document.getElementById("calc-activity")?.value || p.activity_level || "moderate";
    const weather = document.getElementById("water-weather").value;
    const walkingMin = document.getElementById("water-walk-min").value;
    const workoutMin = document.getElementById("water-workout-min").value;

    const rec = waterIntakeAdvanced({ weightKg, weather, activity, walkingMin, workoutMin });
    results.innerHTML = `
      <div class="text-center">
        <p class="text-[11px] text-sapphire-400 mb-1">Base</p>
        <p class="stat-number text-xl font-700 text-sapphire-800 dark:text-white">${fmt(rec.base / 1000, 2)} L</p>
      </div>
      <div class="text-center">
        <p class="text-[11px] text-sapphire-400 mb-1">Exercise</p>
        <p class="stat-number text-xl font-700 text-sapphire-800 dark:text-white">+${fmt(rec.exercise / 1000, 2)} L</p>
      </div>
      <div class="text-center">
        <p class="text-[11px] text-sapphire-400 mb-1">Hot Weather</p>
        <p class="stat-number text-xl font-700 text-sapphire-800 dark:text-white">+${fmt(rec.hotWeather / 1000, 2)} L</p>
      </div>
      <div class="text-center bg-sky-500/10 rounded-xl py-2">
        <p class="text-[11px] text-sky-600 dark:text-sky-300 mb-1 font-semibold">Total / day</p>
        <p class="stat-number text-xl font-700 text-sky-700 dark:text-sky-200">${fmt(rec.total / 1000, 2)} L</p>
      </div>
    `;
    document.getElementById("water-weather").onchange = computeWater;
    document.getElementById("water-walk-min").oninput = computeWater;
    document.getElementById("water-workout-min").oninput = computeWater;
  }

  function signed(n) {
    const v = fmt(n, 2);
    return n > 0 ? `+${v}` : v;
  }

  function resultCard(icon, label, value, unit, sub) {
    return `
      <div class="card p-5">
        <div class="flex items-center gap-2 text-sapphire-400 dark:text-sapphire-300 mb-2">
          ${svgIcon(icon, 16)}
          <span class="text-xs font-semibold uppercase tracking-wide">${label}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="stat-number text-2xl sm:text-3xl font-700 text-sapphire-800 dark:text-white">${value}</span>
          <span class="text-xs text-sapphire-400">${unit}</span>
        </div>
        <p class="text-[11px] text-sapphire-400 dark:text-sapphire-400 mt-1">${sub}</p>
      </div>
    `;
  }

  function macroMini(label, grams, unit, color) {
    const cals = label === "Fat" ? grams * 9 : label === "Fiber" ? 0 : grams * 4;
    return `
      <div>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-sm font-medium text-sapphire-600 dark:text-sapphire-200">${label}</span>
          <span class="text-sm font-700 text-sapphire-800 dark:text-white">${fmt(grams)}${unit}</span>
        </div>
        <div class="macro-bar-track h-2">
          <div class="macro-bar-fill ${color}" style="width: 100%"></div>
        </div>
        <p class="text-[11px] text-sapphire-400 mt-1">${label === "Fiber" ? "Daily target" : fmt(cals) + " kcal"}</p>
      </div>
    `;
  }

  async function saveProfile() {
    const btn = document.getElementById("calc-save-btn");
    btn.disabled = true;
    btn.textContent = "Saving...";
    try {
      const { gender, age, weightKg, goalWeightKg, heightCm, activity, goal, diffRaw } = readInputs();
      const gt = GOAL_TYPES[normalizeGoal(goal)];
      const payload = {
        gender, age, height_cm: heightCm, weight_kg: weightKg,
        activity_level: activity, goal,
        goal_weight_kg: goalWeightKg,
        calorie_diff: gt.direction === 0 ? 0 : (diffRaw === "" ? null : parseFloat(diffRaw)),
      };
      const data = await Api.put("/profile", payload);
      AppState.profile = data.profile;
      showToast("Profile saved! Your daily targets are updated.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Calculate & Save Profile";
    }
  }

  return { render };
})();
