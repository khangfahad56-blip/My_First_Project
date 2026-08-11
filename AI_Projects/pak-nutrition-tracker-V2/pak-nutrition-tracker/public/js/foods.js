// Food Database page: browse, search, filter by category, favorites, recent searches
const Foods = (() => {
  let allCategories = [];
  let currentFilter = { search: "", category: "all", favoritesOnly: false };
  let results = [];
  let favoriteIds = new Set();
  let recentSearches = [];
  let selectedFood = null;

  async function render() {
    const el = document.getElementById("section-foods");
    el.innerHTML = `<div class="animate-pulse-soft text-sapphire-400 text-sm py-12 text-center">Loading food database…</div>`;

    const [catRes, favRes, historyRes] = await Promise.all([
      Api.get("/foods/categories"),
      Api.get("/foods/favorites/list"),
      Api.get("/foods/history/recent"),
    ]);
    allCategories = catRes.categories;
    favoriteIds = new Set(favRes.favoriteIds);
    recentSearches = historyRes.history;

    draw();
    search();
  }

  function draw() {
    const el = document.getElementById("section-foods");
    el.innerHTML = `
      <div class="animate-in">
        <div class="mb-6">
          <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Food Database</h2>
          <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">267+ Pakistani foods with full nutrition info.</p>
        </div>

        <div class="card p-4 sm:p-5 mb-5">
          <div class="relative mb-3">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sapphire-300">${svgIcon("search", 16)}</span>
            <input type="text" id="food-search-input" class="input-field pl-9" placeholder="Search foods, e.g. biryani, daal, roti…" autocomplete="off" />
          </div>
          ${recentSearches.length ? `
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-[11px] text-sapphire-400 self-center">Recent:</span>
            ${recentSearches.slice(0, 6).map((q) => `<button class="chip recent-chip" data-q="${q}">${q}</button>`).join("")}
          </div>` : ""}
          <div class="flex flex-wrap gap-2 items-center">
            <button class="seg-btn cat-btn ${currentFilter.category === "all" ? "active" : ""}" data-cat="all">All</button>
            ${allCategories.map((c) => `<button class="seg-btn cat-btn ${currentFilter.category === c ? "active" : ""}" data-cat="${c}">${c}</button>`).join("")}
            <button id="fav-toggle-btn" class="seg-btn ml-auto ${currentFilter.favoritesOnly ? "active" : ""}">${svgIcon("star", 14)} Favorites</button>
          </div>
        </div>

        <div id="food-results" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"></div>
      </div>

      <!-- Add to meal modal -->
      <div id="foodpage-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-sapphire-900/40 backdrop-blur-sm">
        <div class="card w-full max-w-sm p-5">
          <h3 class="font-display font-600 text-sapphire-700 dark:text-white mb-1" id="fp-food-name">Food</h3>
          <p class="text-xs text-sapphire-400 mb-4" id="fp-serving-info">1 serving</p>
          <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Meal</label>
          <select id="fp-meal-select" class="input-field mb-3">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <label class="text-xs font-semibold text-sapphire-500 dark:text-sapphire-300 mb-1.5 block">Servings</label>
          <input type="number" id="fp-qty" class="input-field mb-4" value="1" min="0.1" step="0.1" />
          <div class="flex gap-2">
            <button id="fp-cancel" class="btn-secondary flex-1">Cancel</button>
            <button id="fp-confirm" class="btn-primary flex-1">Add to Meal</button>
          </div>
        </div>
      </div>
    `;

    let debounce;
    document.getElementById("food-search-input").addEventListener("input", (e) => {
      currentFilter.search = e.target.value;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        search();
        if (e.target.value.trim().length > 2) Api.post("/foods/history/recent", { query: e.target.value.trim() });
      }, 250);
    });

    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter.category = btn.dataset.cat;
        document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        search();
      });
    });

    document.getElementById("fav-toggle-btn").addEventListener("click", (e) => {
      currentFilter.favoritesOnly = !currentFilter.favoritesOnly;
      e.currentTarget.classList.toggle("active");
      search();
    });

    document.querySelectorAll(".recent-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.getElementById("food-search-input").value = chip.dataset.q;
        currentFilter.search = chip.dataset.q;
        search();
      });
    });

    document.getElementById("fp-cancel").addEventListener("click", closeModal);
    document.getElementById("foodpage-modal").addEventListener("click", (e) => {
      if (e.target.id === "foodpage-modal") closeModal();
    });
    document.getElementById("fp-confirm").addEventListener("click", confirmAdd);
  }

  async function search() {
    const params = new URLSearchParams();
    if (currentFilter.search) params.set("search", currentFilter.search);
    if (currentFilter.category !== "all") params.set("category", currentFilter.category);
    if (currentFilter.favoritesOnly) params.set("favoritesOnly", "true");
    const res = await Api.get(`/foods?${params.toString()}`);
    results = res.foods;
    renderResults();
  }

  function renderResults() {
    const container = document.getElementById("food-results");
    if (!container) return;
    if (results.length === 0) {
      container.innerHTML = `<p class="col-span-full text-center text-sapphire-300 py-12 text-sm">No foods match your search.</p>`;
      return;
    }
    container.innerHTML = results.map((f) => `
      <div class="card p-4 flex flex-col gap-2">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="font-medium text-sm text-sapphire-800 dark:text-white truncate">${f.name}</p>
            <p class="text-[11px] text-sapphire-400">${f.serving_size}</p>
          </div>
          <button class="fav-btn shrink-0 ${favoriteIds.has(f.id) ? "text-saffron-500" : "text-sapphire-200 dark:text-sapphire-600"}" data-id="${f.id}">
            ${svgIcon(favoriteIds.has(f.id) ? "star" : "starOutline", 18)}
          </button>
        </div>
        <div class="grid grid-cols-4 gap-1 text-center text-[11px] py-1">
          <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.calories)}</p><p class="text-sapphire-400">kcal</p></div>
          <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.protein)}</p><p class="text-sapphire-400">protein</p></div>
          <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.fat)}</p><p class="text-sapphire-400">fat</p></div>
          <div><p class="font-700 text-sapphire-800 dark:text-white">${fmt(f.carbs)}</p><p class="text-sapphire-400">carbs</p></div>
        </div>
        <button class="btn-secondary text-xs w-full add-to-meal-btn" data-id="${f.id}">Add to Meal</button>
      </div>
    `).join("");

    container.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const res = await Api.post(`/foods/${btn.dataset.id}/favorite`);
        if (res.favorited) favoriteIds.add(parseInt(btn.dataset.id));
        else favoriteIds.delete(parseInt(btn.dataset.id));
        renderResults();
      });
    });

    container.querySelectorAll(".add-to-meal-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedFood = results.find((f) => f.id == btn.dataset.id);
        openModal();
      });
    });
  }

  function openModal() {
    document.getElementById("fp-food-name").textContent = selectedFood.name;
    document.getElementById("fp-serving-info").textContent = `1 serving = ${selectedFood.serving_size} · ${fmt(selectedFood.calories)} kcal`;
    document.getElementById("fp-qty").value = 1;
    document.getElementById("foodpage-modal").classList.remove("hidden");
    document.getElementById("foodpage-modal").classList.add("flex");
  }
  function closeModal() {
    document.getElementById("foodpage-modal").classList.add("hidden");
    document.getElementById("foodpage-modal").classList.remove("flex");
  }

  async function confirmAdd() {
    const qty = parseFloat(document.getElementById("fp-qty").value);
    if (!qty || qty <= 0) return showToast("Enter a valid quantity", "error");
    const mealType = document.getElementById("fp-meal-select").value;
    const f = selectedFood;
    await Api.post("/meals", {
      log_date: AppState.selectedDate,
      meal_type: mealType,
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
    closeModal();
    showToast(`Added ${f.name} to ${mealType} (${AppState.selectedDate === AppState.todayISO() ? "today" : AppState.selectedDate})`);
  }

  return { render };
})();
