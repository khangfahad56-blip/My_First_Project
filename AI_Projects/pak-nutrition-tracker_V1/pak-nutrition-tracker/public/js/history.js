// History page: view Today / Yesterday / This Week / This Month
const History = (() => {
  let range = "week";

  async function render() {
    const el = document.getElementById("section-history");
    el.innerHTML = `<div class="animate-pulse-soft text-sapphire-400 text-sm py-12 text-center">Loading history…</div>`;
    await draw();
  }

  async function draw() {
    const el = document.getElementById("section-history");
    const res = await Api.get(`/dashboard/history?range=${range}`);

    const dayMap = {};
    res.meals.forEach((m) => (dayMap[m.log_date] = { ...m }));
    const weightMap = {};
    res.weights.forEach((w) => (weightMap[w.log_date] = w.weight_kg));
    const walkMap = {};
    res.walking.forEach((w) => (walkMap[w.log_date] = w));

    // Build a unified list of dates in range
    const dates = [];
    const start = new Date(res.startDate);
    const end = new Date(res.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().slice(0, 10));
    }
    dates.reverse();

    el.innerHTML = `
      <div class="animate-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">History</h2>
            <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">Review your past days at a glance.</p>
          </div>
          <div class="flex gap-1.5">
            ${rangeBtn("today", "Today")}
            ${rangeBtn("yesterday", "Yesterday")}
            ${rangeBtn("week", "This Week")}
            ${rangeBtn("month", "This Month")}
          </div>
        </div>

        <div class="card overflow-x-auto">
          <table class="data-table min-w-[640px]">
            <thead>
              <tr>
                <th>Date</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Carbs</th>
                <th>Walking</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              ${dates.map((date) => {
                const m = dayMap[date];
                const w = walkMap[date];
                return `
                <tr class="hover:bg-sapphire-50/50 dark:hover:bg-white/5 cursor-pointer view-day-row" data-date="${date}">
                  <td class="font-medium text-sapphire-700 dark:text-white">${fmtDate(date)}</td>
                  <td>${m ? fmt(m.calories) : "–"}</td>
                  <td>${m ? fmt(m.protein) + "g" : "–"}</td>
                  <td>${m ? fmt(m.fat) + "g" : "–"}</td>
                  <td>${m ? fmt(m.carbs) + "g" : "–"}</td>
                  <td>${w && w.calories ? fmt(w.calories) + " kcal" : "–"}</td>
                  <td>${weightMap[date] ? fmt(weightMap[date], 1) + " kg" : "–"}</td>
                </tr>
              `;}).join("")}
            </tbody>
          </table>
        </div>
        <p class="text-[11px] text-sapphire-400 mt-3 text-center">Click a row to open that day on the Dashboard.</p>
      </div>
    `;

    document.querySelectorAll(".range-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        range = btn.dataset.range;
        draw();
      });
    });

    document.querySelectorAll(".view-day-row").forEach((row) => {
      row.addEventListener("click", () => {
        AppState.selectedDate = row.dataset.date;
        App.navigate("dashboard");
      });
    });
  }

  function rangeBtn(key, label) {
    return `<button class="seg-btn range-btn ${range === key ? "active" : ""}" data-range="${key}">${label}</button>`;
  }

  return { render };
})();
