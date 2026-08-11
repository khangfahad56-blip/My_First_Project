// Meal Tracker page: log foods to Breakfast/Lunch/Dinner/Snack, plus water & walking.
// Includes a live "Today's Impact" summary that updates on every log (project requirement #3)
// and an advanced walking calculator that shows its effect on the calorie goal (requirements #4, #5).
const Tracker = (() => {
  const MEAL_TYPES = [
    { key: "breakfast", label: "Breakfast", icon: "🌅" },
    { key: "lunch", label: "Lunch", icon: "☀️" },
    { key: "dinner", label: "Dinner", icon: "🌙" },
    { key: "snack", label: "Snack", icon: "🍎" },
  ];
  const TERRAIN_OPTIONS = [
    { key: "flat", label: "Flat" },
    { key: "slight_incline", label: "Slight Incline" },
    { key: "steep_incline", label: "Steep Incline" },
    { key: "trail", label: "Trail" },
    { key: "treadmill", label: "Treadmill" },
  ];
  const WALK_TYPE_OPTIONS = [
    { key: "normal", label: "Normal" },
    { key: "brisk", label: "Brisk" },
    { key: "power_walk", label: "Power Walk" },
    { key: "weighted_backpack", label: "Weighted Backpack" },
  ];
  const SPEED_PRESETS = [2, 3, 4, 5, 6, 7];

  let meals = [];
  let water = { logs: [], total: 0 };
  let walking = { logs: [], totalCalories: 0, totalDistance: 0, totalSteps: 0 };
  let pickerMealType = null;
  let pickerFoods = [];
  let pickerSelected = null;
  let walkPreviewDebounce = null;

  async function render() {
    const el = document.getElementById("section-tracker");
    el.innerHTML = `<div class="animate-pulse-soft text-sapphire-400 text-sm py-12 text-center">Loading meal tracker…</div>`;
    await loadData();
    draw();
  }

  async function loadData() {
    const [mealsRes, waterRes, walkingRes] = await Promise.all([
      Api.get(`/meals?date=${AppState.selectedDate}`),
      Api.get(`/water?date=${AppState.selectedDate}`),
      Api.get(`/walking?date=${AppState.selectedDate}`),
    ]);
    meals = mealsRes.meals;
    water = waterRes;
    walking = walkingRes;
  }

  function totalCaloriesEaten() { return meals.reduce((s, m) => s + m.calories, 0); }

  function draw() {
    const el = document.getElementById("section-tracker");
    el.innerHTML = `
      <div class="animate-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Meal Tracker</h2>
            <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">${fmtDate(AppState.selectedDate)}</p>
          </div>
          <input type="date" id="tracker-date" value="${AppState.selectedDate}" class="input-field w-auto text-sm" max="${AppState.todayISO()}" />
        </div>

        <div id="impact-summary" class="mb-6"></div>

        <div class="space-y-5 mb-6">
          ${MEAL_TYPES.map(renderMealCard).join("")}
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          ${renderWaterCard()}
          ${renderWalkingCard()}
        </div>
      </div>

      <!-- Food Picker Modal -->
      <div id="food-picker-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-sapphire-900/40 backdrop-blur-sm">
        <div class="card w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
          <div class="p-4 border-b border-sapphire-100 dark:border-white/10 flex items-center justify-between">
            <h3 class="font-display font-600 text-sapphire-700 dark:text-white" id="picker-title">Add Food</h3>
            <button id="picker-close" class="btn-ghost">✕</button>
          </div>
          <div class="p-4 border-b border-sapphire-100 dark:border-white/10">
            <div class="relative">
              ${svgIconWrap("search", "absolute left-3 top-1/2 -translate-y-1/2 text-sapphire-300")}
              <input type="text" id="picker-search" class="input-field pl-9" placeholder="Search Pakistani foods…" autocomplete="off" />
            </div>
          </div>
          <div id="picker-results" class="overflow-y-auto flex-1 p-2"></div>
        </div>
      </div>

      <!-- Quantity Modal -->
      <div id="qty-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-sapphire-900/40 backdrop-blur-sm">
        <div class="card w-full max-w-sm p-5">
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-1" id="qty-food-name">Food</h3>
          <p class="text-xs text-sapphire-400 mb-4" id="qty-serving-info">1 serving</p>
          <label class="form-label">Number of servings</label>
          <input type="number" id="qty-input" class="input-field mb-4" value="1" min="0.1" step="0.1" />
          <div id="qty-preview" class="text-xs text-sapphire-400 mb-4"></div>
          <div class="flex gap-2">
            <button id="qty-cancel" class="btn-secondary flex-1">Cancel</button>
            <button id="qty-confirm" class="btn-primary flex-1">Add to Meal</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("tracker-date").addEventListener("change", async (e) => {
      AppState.selectedDate = e.target.value;
      await render();
    });

    MEAL_TYPES.forEach((mt) => {
      const addBtn = document.getElementById(`add-food-${mt.key}`);
      if (addBtn) addBtn.addEventListener("click", () => openPicker(mt.key));
    });

    el.querySelectorAll(".delete-meal-item").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await Api.del(`/meals/${btn.dataset.id}`);
        showToast("Removed from meal log", "info");
        await render();
      });
    });

    drawImpactSummary();
    setupWaterHandlers();
    setupWalkingHandlers();
    setupPickerHandlers();
  }

  // ===== Live "Today's Impact" summary (project requirements #3 & #5) =====
  function drawImpactSummary() {
    const wrap = document.getElementById("impact-summary");
    const p = AppState.profile || {};
    const target = p.target_calories || 2000;
    const consumed = totalCaloriesEaten();
    const walkBurned = walking.totalCalories || 0;
    const remaining = target - consumed + walkBurned; // effective remaining after walking credit
    const effectiveIntake = consumed - walkBurned;
    const currentDeficit = target - effectiveIntake; // positive = deficit, negative = surplus
    const weeklyRate = Math.abs((currentDeficit * 7) / 7700);
    const isDeficit = currentDeficit >= 0;

    wrap.innerHTML = `
      <div class="card p-5">
        <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-4 flex items-center gap-2">
          ${svgIcon("dashboard", 16)} Today's Impact
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Target</p>
            <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${fmt(target)}</p>
          </div>
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Consumed</p>
            <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${fmt(consumed)}</p>
          </div>
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Walking Burned</p>
            <p class="stat-number text-lg font-700 text-leaf-600 dark:text-leaf-400">-${fmt(walkBurned)}</p>
          </div>
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Effective Intake</p>
            <p class="stat-number text-lg font-700 text-sapphire-800 dark:text-white">${fmt(effectiveIntake)}</p>
          </div>
          <div>
            <p class="text-[11px] text-sapphire-400 mb-1">Remaining</p>
            <p class="stat-number text-lg font-700 ${remaining >= 0 ? "text-sapphire-800 dark:text-white" : "text-red-500"}">${fmt(remaining)}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-sapphire-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span class="chip ${isDeficit ? "leaf" : "gold"}">Current ${isDeficit ? "Deficit" : "Surplus"}: ${fmt(Math.abs(currentDeficit))} kcal</span>
          <span class="text-xs text-sapphire-500 dark:text-sapphire-300">Expected weekly ${isDeficit ? "fat loss" : "weight gain"}: <strong class="text-sapphire-800 dark:text-white">${fmt(weeklyRate, 2)} kg</strong></span>
        </div>
      </div>
    `;
  }

  function renderMealCard(mt) {
    const items = meals.filter((m) => m.meal_type === mt.key);
    const totalCals = items.reduce((s, m) => s + m.calories, 0);
    return `
      <div class="card p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">${mt.icon}</span>
            <h3 class="font-display font-600 text-sapphire-700 dark:text-white">${mt.label}</h3>
            <span class="chip">${fmt(totalCals)} kcal</span>
          </div>
          <button id="add-food-${mt.key}" class="btn-secondary text-xs flex items-center gap-1">${svgIcon("plus", 14)} Add Food</button>
        </div>
        ${items.length === 0 ? `<p class="text-sm text-sapphire-300 dark:text-sapphire-500 py-3 text-center">No foods logged yet</p>` : `
        <div class="space-y-2">
          ${items.map((m) => `
            <div class="flex items-center justify-between bg-sapphire-50/60 dark:bg-white/5 rounded-xl px-3 py-2.5">
              <div class="min-w-0">
                <p class="text-sm font-medium text-sapphire-700 dark:text-white truncate">${m.food_name}</p>
                <p class="text-[11px] text-sapphire-400">${fmt(m.quantity, 2)} serving${m.quantity != 1 ? "s" : ""} · P ${fmt(m.protein)}g · F ${fmt(m.fat)}g · C ${fmt(m.carbs)}g</p>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-sm font-700 text-sapphire-800 dark:text-white">${fmt(m.calories)}</span>
                <button class="delete-meal-item text-sapphire-300 hover:text-red-500 transition" data-id="${m.id}">${svgIcon("trash", 15)}</button>
              </div>
            </div>
          `).join("")}
        </div>`}
      </div>
    `;
  }

  function renderWaterCard() {
    const cupsMl = [250, 500];
    const p = AppState.profile || {};
    const targetMl = p.target_water_ml || 2500;
    const pct = Math.max(0, Math.min(100, (water.total / targetMl) * 100));
    return `
      <div class="card p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">${svgIcon("water", 17)}</div>
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white">Water Intake</h3>
        </div>
        <div class="flex items-baseline gap-1.5 mb-1">
          <span class="stat-number text-2xl font-700 text-sapphire-800 dark:text-white">${fmt(water.total)} ml</span>
          <span class="text-xs text-sapphire-400">of ${fmt(targetMl)} ml goal</span>
        </div>
        <div class="macro-bar-track h-2.5 mb-3">
          <div class="macro-bar-fill bg-sky-500" style="width: ${pct}%"></div>
        </div>
        <div class="flex flex-wrap gap-2 mb-2">
          ${cupsMl.map((ml) => `<button class="btn-secondary text-xs add-water-btn" data-ml="${ml}">+${ml} ml</button>`).join("")}
          <div class="flex items-center gap-1">
            <input type="number" id="custom-water-ml" class="input-field w-24 text-xs py-1.5" placeholder="ml" min="1" />
            <button id="add-custom-water" class="btn-secondary text-xs">Add</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderWalkingCard() {
    return `
      <div class="card p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-9 h-9 rounded-xl bg-leaf-500/10 text-leaf-500 flex items-center justify-center">${svgIcon("walk", 17)}</div>
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white">Walking</h3>
        </div>
        <p class="stat-number text-2xl font-700 text-sapphire-800 dark:text-white mb-1">${fmt(walking.totalCalories)} kcal</p>
        <p class="text-[11px] text-sapphire-400 mb-3">${fmt(walking.totalDistance, 1)} km · ${fmt(walking.totalSteps)} steps today</p>

        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="form-label">Distance (km)</label>
            <input type="number" id="walk-dist" class="input-field text-xs py-1.5" placeholder="e.g. 3" min="0" step="0.1" />
          </div>
          <div>
            <label class="form-label">Duration (min)</label>
            <input type="number" id="walk-time" class="input-field text-xs py-1.5" placeholder="e.g. 30" min="0" step="1" />
          </div>
        </div>
        <div class="mb-2">
          <label class="form-label">Speed (km/h)</label>
          <div class="flex flex-wrap gap-1.5 mb-1.5" id="walk-speed-presets">
            ${SPEED_PRESETS.map((s) => `<button type="button" class="chip walk-speed-btn" data-speed="${s}">${s} km/h</button>`).join("")}
          </div>
          <input type="number" id="walk-speed" class="input-field text-xs py-1.5" placeholder="custom km/h" min="0" step="0.1" />
        </div>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="form-label">Terrain</label>
            <select id="walk-terrain" class="input-field text-xs py-1.5">
              ${TERRAIN_OPTIONS.map((t) => `<option value="${t.key}">${t.label}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="form-label">Walking Type</label>
            <select id="walk-type" class="input-field text-xs py-1.5">
              ${WALK_TYPE_OPTIONS.map((t) => `<option value="${t.key}">${t.label}</option>`).join("")}
            </select>
          </div>
        </div>
        <input type="number" id="walk-steps" class="input-field text-xs py-1.5 mb-2" placeholder="steps (optional)" min="0" step="1" />

        <div id="walk-preview" class="text-[11px] text-sapphire-400 mb-2 min-h-[1.2em]"></div>
        <button id="add-walk-btn" class="btn-secondary text-xs w-full">Log Walk</button>
      </div>
    `;
  }

  function setupWaterHandlers() {
    document.querySelectorAll(".add-water-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await Api.post("/water", { amount_ml: parseFloat(btn.dataset.ml), log_date: AppState.selectedDate });
        showToast(`Added ${btn.dataset.ml} ml water`);
        await render();
      });
    });
    const customBtn = document.getElementById("add-custom-water");
    if (customBtn) {
      customBtn.addEventListener("click", async () => {
        const val = parseFloat(document.getElementById("custom-water-ml").value);
        if (!val || val <= 0) return showToast("Enter a valid amount", "error");
        await Api.post("/water", { amount_ml: val, log_date: AppState.selectedDate });
        showToast(`Added ${val} ml water`);
        await render();
      });
    }
  }

  function setupWalkingHandlers() {
    const btn = document.getElementById("add-walk-btn");
    if (!btn) return;

    document.querySelectorAll(".walk-speed-btn").forEach((chipBtn) => {
      chipBtn.addEventListener("click", () => {
        document.getElementById("walk-speed").value = chipBtn.dataset.speed;
        document.querySelectorAll(".walk-speed-btn").forEach((b) => b.classList.remove("chip-active"));
        chipBtn.classList.add("chip-active");
        updateWalkPreview();
      });
    });

    ["walk-dist", "walk-time", "walk-speed", "walk-terrain", "walk-type"].forEach((id) => {
      const inputEl = document.getElementById(id);
      inputEl.addEventListener("input", updateWalkPreview);
      inputEl.addEventListener("change", updateWalkPreview);
    });

    btn.addEventListener("click", async () => {
      const distance_km = parseFloat(document.getElementById("walk-dist").value) || null;
      const duration_min = parseFloat(document.getElementById("walk-time").value) || null;
      const speed_kmh = parseFloat(document.getElementById("walk-speed").value) || null;
      const steps = parseFloat(document.getElementById("walk-steps").value) || null;
      const terrain = document.getElementById("walk-terrain").value;
      const walk_type = document.getElementById("walk-type").value;
      if (!distance_km && !duration_min && !speed_kmh) {
        return showToast("Enter at least two of speed, time, or distance", "error");
      }
      try {
        const res = await Api.post("/walking", { distance_km, duration_min, speed_kmh, steps, terrain, walk_type, log_date: AppState.selectedDate });
        showToast(`Logged walk · ${fmt(res.caloriesBurned)} kcal burned (MET ${fmt(res.met, 1)})`);
        await render();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  async function updateWalkPreview() {
    clearTimeout(walkPreviewDebounce);
    walkPreviewDebounce = setTimeout(async () => {
      const distance_km = document.getElementById("walk-dist").value;
      const duration_min = document.getElementById("walk-time").value;
      const speed_kmh = document.getElementById("walk-speed").value;
      const terrain = document.getElementById("walk-terrain").value;
      const walk_type = document.getElementById("walk-type").value;
      const previewEl = document.getElementById("walk-preview");
      if (!distance_km && !duration_min && !speed_kmh) {
        previewEl.textContent = "";
        return;
      }
      try {
        const params = new URLSearchParams({ distance_km, duration_min, speed_kmh, terrain, walk_type });
        const res = await Api.get(`/walking/preview?${params.toString()}`);
        if (!res.durationMin) { previewEl.textContent = ""; return; }
        previewEl.innerHTML = `<strong class="text-sapphire-700 dark:text-white">${fmt(res.caloriesBurned)} kcal</strong> · ${fmt(res.distanceKm, 2)} km · ${fmt(res.durationMin)} min · avg ${fmt(res.avgSpeedKmh, 1)} km/h · MET ${fmt(res.met, 1)}`;
      } catch (err) { /* ignore preview errors */ }
    }, 250);
  }

  // ===== Food Picker =====
  function openPicker(mealType) {
    pickerMealType = mealType;
    document.getElementById("picker-title").textContent = `Add to ${MEAL_TYPES.find((m) => m.key === mealType).label}`;
    document.getElementById("food-picker-modal").classList.remove("hidden");
    document.getElementById("food-picker-modal").classList.add("flex");
    document.getElementById("picker-search").value = "";
    document.getElementById("picker-search").focus();
    searchPickerFoods("");
  }

  function closePicker() {
    document.getElementById("food-picker-modal").classList.add("hidden");
    document.getElementById("food-picker-modal").classList.remove("flex");
  }

  async function searchPickerFoods(query) {
    const res = await Api.get(`/foods?search=${encodeURIComponent(query)}`);
    pickerFoods = res.foods;
    const container = document.getElementById("picker-results");
    if (pickerFoods.length === 0) {
      container.innerHTML = `<p class="text-sm text-sapphire-300 text-center py-8">No foods found</p>`;
      return;
    }
    container.innerHTML = pickerFoods.slice(0, 60).map((f) => `
      <div class="picker-item flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sapphire-50 dark:hover:bg-white/5 cursor-pointer transition" data-id="${f.id}">
        <div class="min-w-0">
          <p class="text-sm font-medium text-sapphire-700 dark:text-white truncate">${f.name}</p>
          <p class="text-[11px] text-sapphire-400">${f.serving_size} · ${f.category}</p>
        </div>
        <span class="text-sm font-700 text-sapphire-800 dark:text-white shrink-0 ml-2">${fmt(f.calories)} kcal</span>
      </div>
    `).join("");
    container.querySelectorAll(".picker-item").forEach((item) => {
      item.addEventListener("click", () => {
        const food = pickerFoods.find((f) => f.id == item.dataset.id);
        openQuantityModal(food);
      });
    });
  }

  function setupPickerHandlers() {
    document.getElementById("picker-close").addEventListener("click", closePicker);
    document.getElementById("food-picker-modal").addEventListener("click", (e) => {
      if (e.target.id === "food-picker-modal") closePicker();
    });
    let debounce;
    document.getElementById("picker-search").addEventListener("input", (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => searchPickerFoods(e.target.value), 200);
    });

    document.getElementById("qty-cancel").addEventListener("click", closeQtyModal);
    document.getElementById("qty-modal").addEventListener("click", (e) => {
      if (e.target.id === "qty-modal") closeQtyModal();
    });
    document.getElementById("qty-input").addEventListener("input", updateQtyPreview);
    document.getElementById("qty-confirm").addEventListener("click", confirmAddFood);
  }

  function openQuantityModal(food) {
    pickerSelected = food;
    document.getElementById("qty-food-name").textContent = food.name;
    document.getElementById("qty-serving-info").textContent = `1 serving = ${food.serving_size}`;
    document.getElementById("qty-input").value = 1;
    updateQtyPreview();
    document.getElementById("qty-modal").classList.remove("hidden");
    document.getElementById("qty-modal").classList.add("flex");
  }

  function closeQtyModal() {
    document.getElementById("qty-modal").classList.add("hidden");
    document.getElementById("qty-modal").classList.remove("flex");
  }

  function updateQtyPreview() {
    const qty = parseFloat(document.getElementById("qty-input").value) || 0;
    const f = pickerSelected;
    document.getElementById("qty-preview").innerHTML = `
      <div class="grid grid-cols-4 gap-2 text-center bg-sapphire-50/60 dark:bg-white/5 rounded-xl p-3">
        <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.calories * qty)}</p><p class="text-[10px] text-sapphire-400">kcal</p></div>
        <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.protein * qty)}</p><p class="text-[10px] text-sapphire-400">protein</p></div>
        <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.fat * qty)}</p><p class="text-[10px] text-sapphire-400">fat</p></div>
        <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.carbs * qty)}</p><p class="text-[10px] text-sapphire-400">carbs</p></div>
      </div>
    `;
  }

  async function confirmAddFood() {
    const qty = parseFloat(document.getElementById("qty-input").value);
    if (!qty || qty <= 0) return showToast("Enter a valid quantity", "error");
    const f = pickerSelected;
    await Api.post("/meals", {
      log_date: AppState.selectedDate,
      meal_type: pickerMealType,
      food_id: f.id,
      food_name: f.name,
      quantity: qty,
      calories: f.calories * qty,
      protein: f.protein * qty,
      carbs: f.carbs * qty,
      fat: f.fat * qty,
      fiber: f.fiber * qty,
      sugar: f.sugar * qty,
      sodium: f.sodium * qty,
      potassium: f.potassium * qty,
    });
    closeQtyModal();
    closePicker();
    showToast(`Added ${f.name} to ${pickerMealType}`);
    await render();
  }

  function svgIconWrap(name, cls) {
    return `<span class="${cls}">${svgIcon(name, 16)}</span>`;
  }

  return { render };
})();
