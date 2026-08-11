// Calculator page: all nutrition/fitness formulas, client-side for instant feedback
const Calculator = (() => {
  const ACTIVITY_MULT = { sedentary: 1.2, light: 1.375, moderate: 1.55, heavy: 1.725, athlete: 1.9 };
  const GOAL_ADJ = { lose_weight: -500, lose_fat: -500, maintain: 0, gain_muscle: 300, gain_weight: 500 };

  function bmr({ gender, weightKg, heightCm, age }) {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return gender === "female" ? base - 161 : base + 5;
  }
  function tdee(bmrVal, activity) { return bmrVal * (ACTIVITY_MULT[activity] || 1.55); }
  function targetCalories(tdeeVal, goal) { return Math.max(1200, tdeeVal + (GOAL_ADJ[goal] ?? 0)); }
  function protein(weightKg, goal) {
    let g = 1.8;
    if (goal === "gain_muscle") g = 2.2;
    else if (goal === "lose_fat" || goal === "lose_weight") g = 2.0;
    else if (goal === "maintain") g = 1.6;
    return weightKg * g;
  }
  function fat(weightKg, goal) {
    let g = 0.8;
    if (goal === "lose_fat" || goal === "lose_weight") g = 0.7;
    else if (goal === "gain_muscle" || goal === "gain_weight") g = 0.9;
    return weightKg * g;
  }
  function carbs(cals, proteinG, fatG) {
    const remaining = Math.max(0, cals - proteinG * 4 - fatG * 9);
    return remaining / 4;
  }
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
  function waterIntake(weightKg, activity) {
    let mlPerKg = 35;
    if (activity === "heavy") mlPerKg = 40;
    else if (activity === "athlete") mlPerKg = 45;
    else if (activity === "light") mlPerKg = 33;
    else if (activity === "sedentary") mlPerKg = 30;
    return weightKg * mlPerKg;
  }
  function walkingCalories({ weightKg, distanceKm, durationMin }) {
    let minutes = durationMin;
    if (!minutes && distanceKm) minutes = (distanceKm / 5) * 60;
    if (!minutes) return 0;
    return (3.5 * 3.5 * weightKg / 200) * minutes;
  }
  function weeklyFatLoss(dailyDeficit) { return (dailyDeficit * 7) / 7700; }

  function render() {
    const el = document.getElementById("section-calculator");
    const p = AppState.profile || {};
    el.innerHTML = `
      <div class="animate-in">
        <div class="mb-6">
          <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Calculator</h2>
          <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">Work out your BMR, TDEE, macros, BMI, and more.</p>
        </div>

        <div class="grid lg:grid-cols-5 gap-6">
          <!-- Input Panel -->
          <div class="lg:col-span-2 card p-5 sm:p-6 h-fit">
            <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Your Details</h3>
            <div class="space-y-4">
              <div>
                <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Gender</label>
                <div class="grid grid-cols-2 gap-2">
                  <div class="seg-btn" data-field="gender" data-value="male">Male</div>
                  <div class="seg-btn" data-field="gender" data-value="female">Female</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Age</label>
                  <input type="number" id="calc-age" class="input-field" value="${p.age || 25}" min="1" max="120" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Weight (kg)</label>
                  <input type="number" id="calc-weight" class="input-field" value="${p.weight_kg || 70}" min="1" max="500" step="0.1" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Height (cm)</label>
                <input type="number" id="calc-height" class="input-field" value="${p.height_cm || 170}" min="50" max="250" step="0.5" />
              </div>
              <div>
                <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Activity Level</label>
                <select id="calc-activity" class="input-field">
                  <option value="sedentary">Sedentary (little/no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="heavy">Heavy (6-7 days/week)</option>
                  <option value="athlete">Athlete (2x/day)</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Goal</label>
                <select id="calc-goal" class="input-field">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="lose_fat">Lose Fat</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="gain_weight">Gain Weight</option>
                </select>
              </div>

              <div class="pt-2 border-t border-sapphire-100 dark:border-white/10">
                <p class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-2">Walking (optional)</p>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] text-sapphire-400 dark:text-sapphire-400 mb-1 block">Distance (km)</label>
                    <input type="number" id="calc-walk-dist" class="input-field" placeholder="e.g. 3" min="0" step="0.1" />
                  </div>
                  <div>
                    <label class="text-[11px] text-sapphire-400 dark:text-sapphire-400 mb-1 block">Time (min)</label>
                    <input type="number" id="calc-walk-time" class="input-field" placeholder="e.g. 30" min="0" step="1" />
                  </div>
                </div>
              </div>

              <button id="calc-save-btn" class="btn-primary w-full mt-2">Calculate &amp; Save Profile</button>
            </div>
          </div>

          <!-- Results Panel -->
          <div class="lg:col-span-3 space-y-4" id="calc-results"></div>
        </div>
      </div>
    `;

    // Set selects to current profile values
    el.querySelector("#calc-activity").value = p.activity_level || "moderate";
    el.querySelector("#calc-goal").value = p.goal || "maintain";
    setGenderSeg(p.gender || "male");

    el.querySelectorAll('[data-field="gender"]').forEach((btn) => {
      btn.addEventListener("click", () => setGenderSeg(btn.dataset.value));
    });

    el.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("input", computeAndDisplay);
    });

    el.querySelector("#calc-save-btn").addEventListener("click", saveProfile);

    computeAndDisplay();
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

  function computeAndDisplay() {
    const gender = getGender();
    const age = parseFloat(document.getElementById("calc-age").value) || 25;
    const weightKg = parseFloat(document.getElementById("calc-weight").value) || 70;
    const heightCm = parseFloat(document.getElementById("calc-height").value) || 170;
    const activity = document.getElementById("calc-activity").value;
    const goal = document.getElementById("calc-goal").value;
    const walkDist = parseFloat(document.getElementById("calc-walk-dist").value) || 0;
    const walkTime = parseFloat(document.getElementById("calc-walk-time").value) || 0;

    const bmrVal = bmr({ gender, weightKg, heightCm, age });
    const tdeeVal = tdee(bmrVal, activity);
    const targetCals = targetCalories(tdeeVal, goal);
    const proteinVal = protein(weightKg, goal);
    const fatVal = fat(weightKg, goal);
    const carbsVal = carbs(targetCals, proteinVal, fatVal);
    const bmiVal = bmi(weightKg, heightCm);
    const bmiCat = bmiCategory(bmiVal);
    const bodyFatVal = bodyFatEstimate({ bmiVal, age, gender });
    const idealW = idealWeight(heightCm, gender);
    const waterVal = waterIntake(weightKg, activity);
    const walkCals = walkingCalories({ weightKg, distanceKm: walkDist, durationMin: walkTime });
    const deficit = tdeeVal - targetCals;
    const fatLossPerWeek = weeklyFatLoss(Math.abs(deficit)) * (deficit >= 0 ? 1 : -1);

    const results = document.getElementById("calc-results");
    results.innerHTML = `
      <div class="grid sm:grid-cols-3 gap-4">
        ${resultCard("Fire", "BMR", `${fmt(bmrVal)}`, "kcal/day", "Calories burned at rest")}
        ${resultCard("dashboard", "TDEE", `${fmt(tdeeVal)}`, "kcal/day", "Total daily energy expenditure")}
        ${resultCard("tracker", "Target Calories", `${fmt(targetCals)}`, "kcal/day", `For ${goalLabel(goal)}`)}
      </div>

      <div class="card p-5 sm:p-6">
        <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Daily Macros</h3>
        <div class="grid sm:grid-cols-3 gap-4">
          ${macroMini("Protein", proteinVal, "g", "bg-sky-500")}
          ${macroMini("Fat", fatVal, "g", "bg-saffron-500")}
          ${macroMini("Carbohydrates", carbsVal, "g", "bg-leaf-500")}
        </div>
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
          <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-1">Water Intake</p>
          <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(waterVal / 1000, 2)} L</span>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="card p-5">
          <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-1">Walking Calories Burned</p>
          <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(walkCals)} kcal</span>
          <p class="text-[11px] text-sapphire-400 mt-1">${walkDist ? walkDist + " km" : ""}${walkDist && walkTime ? " · " : ""}${walkTime ? walkTime + " min" : ""}${!walkDist && !walkTime ? "Enter distance or time" : ""}</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-1">Est. Weekly ${deficit >= 0 ? "Fat Loss" : "Weight Gain"}</p>
          <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(Math.abs(fatLossPerWeek), 2)} kg</span>
          <p class="text-[11px] text-sapphire-400 mt-1">Based on 7700 kcal = 1 kg fat</p>
        </div>
      </div>
    `;
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
    const cals = label === "Fat" ? grams * 9 : grams * 4;
    return `
      <div>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-sm font-medium text-sapphire-600 dark:text-sapphire-200">${label}</span>
          <span class="text-sm font-700 text-sapphire-800 dark:text-white">${fmt(grams)}${unit}</span>
        </div>
        <div class="macro-bar-track h-2">
          <div class="macro-bar-fill ${color}" style="width: 100%"></div>
        </div>
        <p class="text-[11px] text-sapphire-400 mt-1">${fmt(cals)} kcal</p>
      </div>
    `;
  }

  async function saveProfile() {
    const btn = document.getElementById("calc-save-btn");
    btn.disabled = true;
    btn.textContent = "Saving...";
    try {
      const payload = {
        gender: getGender(),
        age: parseFloat(document.getElementById("calc-age").value),
        height_cm: parseFloat(document.getElementById("calc-height").value),
        weight_kg: parseFloat(document.getElementById("calc-weight").value),
        activity_level: document.getElementById("calc-activity").value,
        goal: document.getElementById("calc-goal").value,
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
