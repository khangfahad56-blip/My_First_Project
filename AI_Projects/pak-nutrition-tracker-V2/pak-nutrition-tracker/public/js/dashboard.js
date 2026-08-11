// Dashboard page: hero calorie ring + macro plate + stat cards
const Dashboard = (() => {
  let data = null;

  async function render() {
    const el = document.getElementById("section-dashboard");
    el.innerHTML = `<div class="animate-pulse-soft text-sapphire-400 text-sm py-12 text-center">Loading dashboard…</div>`;
    try {
      const res = await Api.get(`/dashboard?date=${AppState.selectedDate}`);
      data = res;
      draw();
    } catch (err) {
      el.innerHTML = `<div class="card p-6 text-red-500 text-sm">Couldn't load dashboard: ${err.message}</div>`;
    }
  }

  function draw() {
    const el = document.getElementById("section-dashboard");
    const { today, remaining, bmi, bmiCategory, bodyFatPct, currentWeight, profile, impact, weeklyProgress, goalProgressPct } = data;
    const t = today.totals;

    const caloriesEaten = t.calories;
    const caloriesBurnedWalk = today.walking.calories;
    const targetCals = profile.target_calories || 2000;
    const netCals = caloriesEaten - caloriesBurnedWalk;
    const pctUsed = Math.max(0, Math.min(1, netCals / targetCals));
    const isDeficit = impact.currentDeficit >= 0;

    const circumference = 2 * Math.PI * 70;
    const dashOffset = circumference * (1 - pctUsed);

    el.innerHTML = `
      <div class="animate-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Dashboard</h2>
            <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">${fmtDate(AppState.selectedDate)} · ${goalLabel(profile.goal)}</p>
          </div>
          <input type="date" id="dash-date" value="${AppState.selectedDate}" class="input-field w-auto text-sm" max="${AppState.todayISO()}" />
        </div>

        <div class="grid lg:grid-cols-3 gap-6 mb-6">
          <!-- Hero: calorie ring -->
          <div class="lg:col-span-1 card glass p-6 flex flex-col items-center justify-center text-center">
            <div class="relative w-44 h-44">
              <svg viewBox="0 0 160 160" class="w-44 h-44 -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke-width="14" class="ring-track" />
                <circle cx="80" cy="80" r="70" fill="none" stroke-width="14"
                  stroke="url(#calGradient)" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"
                  class="ring-progress" />
                <defs>
                  <linearGradient id="calGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1b4b73"/>
                    <stop offset="100%" stop-color="#4a93cc"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="stat-number text-3xl font-700 text-sapphire-800 dark:text-white">${fmt(Math.max(0, remaining.calories))}</span>
                <span class="text-xs text-sapphire-400 dark:text-sapphire-300 font-medium">kcal remaining</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3 mt-5 w-full text-center">
              <div>
                <p class="text-[11px] text-sapphire-400">Eaten</p>
                <p class="font-700 text-sapphire-800 dark:text-white text-sm">${fmt(caloriesEaten)}</p>
              </div>
              <div>
                <p class="text-[11px] text-sapphire-400">Burned</p>
                <p class="font-700 text-sapphire-800 dark:text-white text-sm">${fmt(caloriesBurnedWalk)}</p>
              </div>
              <div>
                <p class="text-[11px] text-sapphire-400">Goal</p>
                <p class="font-700 text-sapphire-800 dark:text-white text-sm">${fmt(targetCals)}</p>
              </div>
            </div>
          </div>

          <!-- Macro plate -->
          <div class="lg:col-span-2 card p-6">
            <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Macros Today</h3>
            <div class="space-y-4">
              ${macroRow("Protein", t.protein, profile.target_protein, "bg-sky-500")}
              ${macroRow("Fat", t.fat, profile.target_fat, "bg-saffron-500")}
              ${macroRow("Carbohydrates", t.carbs, profile.target_carbs, "bg-leaf-500")}
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-sapphire-100 dark:border-white/10">
              <div class="text-center">
                <p class="text-[11px] text-sapphire-400">Fiber</p>
                <p class="font-700 text-sm text-sapphire-800 dark:text-white">${fmt(t.fiber)}g</p>
              </div>
              <div class="text-center">
                <p class="text-[11px] text-sapphire-400">Sugar</p>
                <p class="font-700 text-sm text-sapphire-800 dark:text-white">${fmt(t.sugar)}g</p>
              </div>
              <div class="text-center">
                <p class="text-[11px] text-sapphire-400">Sodium</p>
                <p class="font-700 text-sm text-sapphire-800 dark:text-white">${fmt(t.sodium)}mg</p>
              </div>
              <div class="text-center">
                <p class="text-[11px] text-sapphire-400">Potassium</p>
                <p class="font-700 text-sm text-sapphire-800 dark:text-white">${fmt(t.potassium)}mg</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stat cards -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          ${statCard("water", "Water Intake", `${fmt(today.water)} ml`, `of ${fmt(profile.target_water_ml)} ml goal`, "sky")}
          ${statCard("walk", "Walking", `${fmt(today.walking.distanceKm, 1)} km`, `${fmt(today.walking.calories)} kcal burned`, "leaf")}
          ${statCard("weight", "Current Weight", `${fmt(currentWeight, 1)} kg`, `Ideal range varies`, "sapphire")}
          ${statCard("dashboard", "BMI", `${fmt(bmi, 1)}`, bmiCategory, "saffron")}
          ${statCard(isDeficit ? "fire" : "tracker", isDeficit ? "Current Deficit" : "Current Surplus", `${fmt(Math.abs(impact.currentDeficit))} kcal`, `Effective intake: ${fmt(impact.effectiveIntake)} kcal`, isDeficit ? "leaf" : "saffron")}
          ${statCard("progress", "Weekly Progress", `${fmt(Math.abs(weeklyProgress.avgDeficit))} kcal/day`, `avg ${isDeficit ? "deficit" : "surplus"} · last 7 days`, "sapphire")}
          ${statCard("dashboard", "Protein Remaining", `${fmt(remaining.protein)}g`, `Carbs ${fmt(remaining.carbs)}g · Fat ${fmt(remaining.fat)}g`, "sky")}
          ${goalProgressPct != null ? statCard("weight", "Goal Progress", `${fmt(goalProgressPct, 0)}%`, `toward ${fmt(profile.goal_weight_kg, 1)} kg goal`, "leaf") : statCard("dashboard", "Est. Body Fat", `${fmt(bodyFatPct, 1)}%`, "Deurenberg estimate", "saffron")}
        </div>

        <!-- Body composition breakdown -->
        <div class="mt-6 card p-5 sm:p-6">
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-1">Expected Weekly Change Breakdown</h3>
          <p class="text-xs text-sapphire-400 dark:text-sapphire-300 mb-4">Based on today's effective intake, projected forward across a week. Scale weight includes fat, water, glycogen, and lean mass — not fat alone.</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p class="text-[11px] text-sapphire-400 mb-1">Fat Change</p>
              <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(impact.expectedWeeklyChange.fatChangeKg)} kg</p>
            </div>
            <div>
              <p class="text-[11px] text-sapphire-400 mb-1">Lean Mass Change</p>
              <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(impact.expectedWeeklyChange.leanChangeKg)} kg</p>
            </div>
            <div>
              <p class="text-[11px] text-sapphire-400 mb-1">Water Fluctuation</p>
              <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(impact.expectedWeeklyChange.waterFluctuationKg)} kg</p>
            </div>
            <div>
              <p class="text-[11px] text-sapphire-400 mb-1">Total Scale Change</p>
              <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${signed(impact.expectedWeeklyChange.totalScaleChangeKg)} kg</p>
            </div>
          </div>
        </div>

        <div class="mt-6 card p-5 flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2 text-sapphire-500 dark:text-sapphire-300 text-sm">
            ${svgIcon("dashboard", 16)}
            <span>Estimated body fat: <strong class="text-sapphire-800 dark:text-white">${fmt(bodyFatPct, 1)}%</strong></span>
          </div>
          <div class="flex gap-2">
            <button class="btn-secondary text-xs" onclick="App.navigate('tracker')">Log a meal</button>
            <button class="btn-secondary text-xs" onclick="App.navigate('calculator')">Update profile</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("dash-date").addEventListener("change", (e) => {
      AppState.selectedDate = e.target.value;
      render();
    });
  }

  function signed(n) {
    const v = fmt(n, 2);
    return n > 0 ? `+${v}` : v;
  }

  function macroRow(label, current, target, colorClass) {
    const pct = target ? Math.min(100, (current / target) * 100) : 0;
    return `
      <div>
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-sm font-medium text-sapphire-600 dark:text-sapphire-200">${label}</span>
          <span class="text-sm text-sapphire-500 dark:text-sapphire-300"><strong class="text-sapphire-800 dark:text-white">${fmt(current)}g</strong> / ${fmt(target)}g</span>
        </div>
        <div class="macro-bar-track h-2.5">
          <div class="macro-bar-fill ${colorClass}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }

  function statCard(icon, label, value, sub, color) {
    const colorMap = {
      sky: "text-sky-500 bg-sky-500/10",
      leaf: "text-leaf-500 bg-leaf-500/10",
      sapphire: "text-sapphire-600 bg-sapphire-500/10",
      saffron: "text-saffron-600 bg-saffron-500/10",
    };
    return `
      <div class="card p-5">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}">
          ${svgIcon(icon, 18)}
        </div>
        <p class="text-xs font-semibold text-sapphire-400 dark:text-sapphire-300 mb-0.5">${label}</p>
        <p class="stat-number text-xl font-700 text-sapphire-800 dark:text-white">${value}</p>
        <p class="text-[11px] text-sapphire-400 mt-0.5">${sub}</p>
      </div>
    `;
  }

  return { render };
})();
