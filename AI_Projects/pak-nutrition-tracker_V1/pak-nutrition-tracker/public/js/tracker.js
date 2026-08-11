// Meal Tracker page: log foods to Breakfast/Lunch/Dinner/Snack, plus water & walking
const Tracker = (() => {
  const MEAL_TYPES = [
    { key: "breakfast", label: "Breakfast", icon: "🌅" },
    { key: "lunch", label: "Lunch", icon: "☀️" },
    { key: "dinner", label: "Dinner", icon: "🌙" },
    { key: "snack", label: "Snack", icon: "🍎" },
  ];
  let meals = [];
  let water = { logs: [], total: 0 };
  let walking = { logs: [], totalCalories: 0, totalDistance: 0, totalSteps: 0 };
  let pickerMealType = null;
  let pickerFoods = [];
  let pickerSelected = null;

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
          <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Number of servings</label>
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

    setupWaterHandlers();
    setupWalkingHandlers();
    setupPickerHandlers();
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
    return `
      <div class="card p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">${svgIcon("water", 17)}</div>
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white">Water Intake</h3>
        </div>
        <p class="stat-number text-2xl font-700 text-sapphire-800 dark:text-white mb-3">${fmt(water.total)} ml</p>
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
        <p class="text-[11px] text-sapphire-400 mb-3">${fmt(walking.totalDistance, 1)} km · ${fmt(walking.totalSteps)} steps</p>
        <div class="grid grid-cols-3 gap-2">
          <input type="number" id="walk-dist" class="input-field text-xs py-1.5" placeholder="km" min="0" step="0.1" />
          <input type="number" id="walk-time" class="input-field text-xs py-1.5" placeholder="min" min="0" step="1" />
          <input type="number" id="walk-steps" class="input-field text-xs py-1.5" placeholder="steps" min="0" step="1" />
        </div>
        <button id="add-walk-btn" class="btn-secondary text-xs w-full mt-2">Log Walk</button>
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
    btn.addEventListener("click", async () => {
      const distance_km = parseFloat(document.getElementById("walk-dist").value) || null;
      const duration_min = parseFloat(document.getElementById("walk-time").value) || null;
      const steps = parseFloat(document.getElementById("walk-steps").value) || null;
      if (!distance_km && !duration_min && !steps) {
        return showToast("Enter distance, time, or steps", "error");
      }
      const res = await Api.post("/walking", { distance_km, duration_min, steps, log_date: AppState.selectedDate });
      showToast(`Logged walk · ${fmt(res.caloriesBurned)} kcal burned`);
      await render();
    });
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
