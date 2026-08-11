// Settings page: goals, weight log history, body measurements
const Settings = (() => {
  const GOALS = [
    { key: "fat_loss", label: "Fat Loss", icon: "🔥" },
    { key: "weight_loss", label: "Weight Loss", icon: "📉" },
    { key: "maintenance", label: "Maintenance", icon: "⚖️" },
    { key: "lean_bulk", label: "Lean Bulk", icon: "📈" },
    { key: "muscle_gain", label: "Muscle Gain", icon: "💪" },
  ];
  const LEGACY_GOAL_MAP = {
    lose_weight: "weight_loss", lose_fat: "fat_loss", maintain: "maintenance",
    gain_muscle: "muscle_gain", gain_weight: "lean_bulk",
  };
  function currentGoalKey(goal) { return GOALS.some((g) => g.key === goal) ? goal : (LEGACY_GOAL_MAP[goal] || "maintenance"); }

  async function render() {
    const el = document.getElementById("section-settings");
    el.innerHTML = `<div class="animate-pulse-soft text-sapphire-400 text-sm py-12 text-center">Loading settings…</div>`;
    const [weightRes, measureRes] = await Promise.all([
      Api.get("/weight?limit=20"),
      Api.get("/weight/measurements?limit=20"),
    ]);
    draw(weightRes.logs, measureRes.logs);
  }

  function draw(weightLogs, measureLogs) {
    const el = document.getElementById("section-settings");
    const p = AppState.profile || {};

    el.innerHTML = `
      <div class="animate-in space-y-6">
        <div>
          <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Settings &amp; Goals</h2>
          <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">Manage your goal, weight log, and body measurements.</p>
        </div>

        <div class="card p-5 sm:p-6">
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Your Goal</h3>
          <div class="grid sm:grid-cols-3 lg:grid-cols-5 gap-2">
            ${GOALS.map((g) => `
              <button class="goal-btn seg-btn !py-4 flex flex-col items-center gap-1 ${currentGoalKey(p.goal) === g.key ? "active" : ""}" data-goal="${g.key}">
                <span class="text-xl">${g.icon}</span>
                <span>${g.label}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">
          <div class="card p-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display font-600 text-sapphire-700 dark:text-white">Weight Log</h3>
              <div class="flex items-center gap-2">
                <input type="number" id="new-weight-input" class="input-field w-24 text-sm" placeholder="kg" min="1" step="0.1" />
                <button id="add-weight-btn" class="btn-secondary text-xs">Log</button>
              </div>
            </div>
            <div class="max-h-72 overflow-y-auto">
              <table class="data-table">
                <thead><tr><th>Date</th><th>Weight</th></tr></thead>
                <tbody>
                  ${weightLogs.length === 0 ? `<tr><td colspan="2" class="text-center text-sapphire-300 py-6">No weight logs yet</td></tr>` :
                    [...weightLogs].reverse().map((w) => `<tr><td>${fmtDate(w.log_date)}</td><td class="font-700">${fmt(w.weight_kg, 1)} kg</td></tr>`).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card p-5 sm:p-6">
            <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4">Body Measurements</h3>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div><label class="text-[11px] text-sapphire-400 mb-1 block">Chest (cm)</label><input type="number" id="m-chest" class="input-field text-sm" step="0.1" /></div>
              <div><label class="text-[11px] text-sapphire-400 mb-1 block">Waist (cm)</label><input type="number" id="m-waist" class="input-field text-sm" step="0.1" /></div>
              <div><label class="text-[11px] text-sapphire-400 mb-1 block">Hips (cm)</label><input type="number" id="m-hips" class="input-field text-sm" step="0.1" /></div>
              <div><label class="text-[11px] text-sapphire-400 mb-1 block">Arm (cm)</label><input type="number" id="m-arm" class="input-field text-sm" step="0.1" /></div>
              <div><label class="text-[11px] text-sapphire-400 mb-1 block">Thigh (cm)</label><input type="number" id="m-thigh" class="input-field text-sm" step="0.1" /></div>
              <div><label class="text-[11px] text-sapphire-400 mb-1 block">Body Fat %</label><input type="number" id="m-bf" class="input-field text-sm" step="0.1" /></div>
            </div>
            <button id="save-measurements-btn" class="btn-primary w-full">Save Measurements</button>
            <div class="max-h-40 overflow-y-auto mt-4">
              <table class="data-table">
                <thead><tr><th>Date</th><th>Waist</th><th>Hips</th><th>BF%</th></tr></thead>
                <tbody>
                  ${measureLogs.length === 0 ? `<tr><td colspan="4" class="text-center text-sapphire-300 py-4">No measurements yet</td></tr>` :
                    [...measureLogs].reverse().map((m) => `<tr><td>${fmtDate(m.log_date)}</td><td>${m.waist_cm ?? "–"}</td><td>${m.hips_cm ?? "–"}</td><td>${m.body_fat_pct ?? "–"}</td></tr>`).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card p-5 sm:p-6">
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-2">About</h3>
          <p class="text-sm text-sapphire-500 dark:text-sapphire-300">Pak Nutrition Tracker stores all data locally in a SQLite database on your machine — no account or login required. Head to the Calculator page to update your body stats and activity level any time your targets need recalculating.</p>
        </div>
      </div>
    `;

    document.querySelectorAll(".goal-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          const payload = {
            gender: p.gender, age: p.age, height_cm: p.height_cm, weight_kg: p.weight_kg,
            activity_level: p.activity_level, goal: btn.dataset.goal,
            goal_weight_kg: p.goal_weight_kg, calorie_diff: null, // null = use the new goal's sensible default
          };
          const res = await Api.put("/profile", payload);
          AppState.profile = res.profile;
          showToast(`Goal set to ${goalLabel(btn.dataset.goal)}`);
          document.querySelectorAll(".goal-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    });

    document.getElementById("add-weight-btn").addEventListener("click", async () => {
      const val = parseFloat(document.getElementById("new-weight-input").value);
      if (!val || val <= 0) return showToast("Enter a valid weight", "error");
      await Api.post("/weight", { weight_kg: val, log_date: AppState.selectedDate });
      await loadProfile();
      showToast("Weight logged");
      render();
    });

    document.getElementById("save-measurements-btn").addEventListener("click", async () => {
      const body = {
        log_date: AppState.selectedDate,
        chest_cm: parseFloat(document.getElementById("m-chest").value) || null,
        waist_cm: parseFloat(document.getElementById("m-waist").value) || null,
        hips_cm: parseFloat(document.getElementById("m-hips").value) || null,
        arm_cm: parseFloat(document.getElementById("m-arm").value) || null,
        thigh_cm: parseFloat(document.getElementById("m-thigh").value) || null,
        body_fat_pct: parseFloat(document.getElementById("m-bf").value) || null,
      };
      await Api.post("/weight/measurements", body);
      showToast("Measurements saved");
      render();
    });
  }

  return { render };
})();
