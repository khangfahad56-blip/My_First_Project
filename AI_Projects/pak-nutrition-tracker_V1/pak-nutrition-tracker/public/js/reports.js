// Reports page: generate Daily / Weekly / Monthly reports, export CSV, print
const Reports = (() => {
  let reportType = "daily";
  let lastReport = null;

  async function render() {
    const el = document.getElementById("section-reports");
    el.innerHTML = `<div class="animate-pulse-soft text-sapphire-400 text-sm py-12 text-center">Loading reports…</div>`;
    await draw();
  }

  async function draw() {
    const el = document.getElementById("section-reports");
    const res = await Api.get(`/dashboard/report?type=${reportType}&date=${AppState.selectedDate}`);
    lastReport = res;

    el.innerHTML = `
      <div class="animate-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 no-print">
          <div>
            <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Reports</h2>
            <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">Generate and export nutrition reports.</p>
          </div>
          <div class="flex gap-2 flex-wrap items-center">
            <input type="date" id="report-date" value="${AppState.selectedDate}" class="input-field w-auto text-sm" max="${AppState.todayISO()}" />
            <div class="flex gap-1.5">
              ${typeBtn("daily", "Daily")}
              ${typeBtn("weekly", "Weekly")}
              ${typeBtn("monthly", "Monthly")}
            </div>
          </div>
        </div>

        <div id="report-content" class="card p-6">
          ${reportBody(res)}
        </div>

        <div class="flex gap-2 mt-5 no-print flex-wrap">
          <button id="export-csv-btn" class="btn-secondary flex items-center gap-1.5">${svgIcon("download", 15)} Export CSV</button>
          <button id="print-btn" class="btn-secondary flex items-center gap-1.5">${svgIcon("print", 15)} Print / Save PDF</button>
        </div>
      </div>
    `;

    document.getElementById("report-date").addEventListener("change", (e) => {
      AppState.selectedDate = e.target.value;
      draw();
    });
    document.querySelectorAll(".report-type-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        reportType = btn.dataset.type;
        draw();
      });
    });
    document.getElementById("export-csv-btn").addEventListener("click", exportCSV);
    document.getElementById("print-btn").addEventListener("click", () => window.print());
  }

  function reportBody(res) {
    const p = res.profile;
    const title = res.type === "daily" ? `Daily Report — ${fmtDate(res.startDate)}` :
      res.type === "weekly" ? `Weekly Report — ${fmtDate(res.startDate)} to ${fmtDate(res.endDate)}` :
      `Monthly Report — ${fmtDate(res.startDate)} to ${fmtDate(res.endDate)}`;

    return `
      <div class="flex items-center justify-between mb-5 pb-4 border-b border-sapphire-100 dark:border-white/10">
        <div>
          <h3 class="font-display font-700 text-lg text-sapphire-800 dark:text-white">${title}</h3>
          <p class="text-xs text-sapphire-400 mt-0.5">Goal: ${goalLabel(p.goal)} · Target ${fmt(p.target_calories)} kcal/day</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sapphire-600 to-sky-500 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3c-1 3-4 3.5-4 7a4 4 0 0 0 8 0c0-3.5-3-4-4-7Z" fill="white"/></svg>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        ${reportStat("Avg Calories/day", fmt(res.averages.calories), "kcal")}
        ${reportStat("Avg Protein/day", fmt(res.averages.protein), "g")}
        ${reportStat("Avg Fat/day", fmt(res.averages.fat), "g")}
        ${reportStat("Avg Carbs/day", fmt(res.averages.carbs), "g")}
      </div>

      <div class="grid sm:grid-cols-3 gap-4 mb-6">
        ${reportStat("Total Water", fmt(res.water), "ml")}
        ${reportStat("Walking Calories", fmt(res.walking.calories), "kcal")}
        ${reportStat("Distance Walked", fmt(res.walking.distanceKm, 1), "km")}
      </div>

      <h4 class="font-display font-600 text-sm text-sapphire-700 dark:text-white mb-2">Food Log</h4>
      <div class="overflow-x-auto">
        <table class="data-table min-w-[560px]">
          <thead><tr><th>Date</th><th>Meal</th><th>Food</th><th>Qty</th><th>Kcal</th><th>P</th><th>F</th><th>C</th></tr></thead>
          <tbody>
            ${res.meals.length === 0 ? `<tr><td colspan="8" class="text-center text-sapphire-300 py-6">No food logged in this period</td></tr>` :
              res.meals.map((m) => `
              <tr>
                <td>${fmtDate(m.log_date)}</td>
                <td class="capitalize">${m.meal_type}</td>
                <td>${m.food_name}</td>
                <td>${fmt(m.quantity, 2)}</td>
                <td>${fmt(m.calories)}</td>
                <td>${fmt(m.protein)}g</td>
                <td>${fmt(m.fat)}g</td>
                <td>${fmt(m.carbs)}g</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function reportStat(label, value, unit) {
    return `
      <div class="bg-sapphire-50/60 dark:bg-white/5 rounded-xl p-4 text-center">
        <p class="text-[11px] text-sapphire-400 mb-1">${label}</p>
        <p class="font-700 text-lg text-sapphire-800 dark:text-white">${value} <span class="text-xs font-normal text-sapphire-400">${unit}</span></p>
      </div>
    `;
  }

  function typeBtn(key, label) {
    return `<button class="seg-btn report-type-btn ${reportType === key ? "active" : ""}" data-type="${key}">${label}</button>`;
  }

  function exportCSV() {
    if (!lastReport) return;
    const rows = [["Date", "Meal", "Food", "Quantity (servings)", "Calories", "Protein (g)", "Fat (g)", "Carbs (g)", "Fiber (g)", "Sugar (g)", "Sodium (mg)", "Potassium (mg)"]];
    lastReport.meals.forEach((m) => {
      rows.push([m.log_date, m.meal_type, m.food_name, m.quantity, m.calories, m.protein, m.fat, m.carbs, m.fiber, m.sugar, m.sodium, m.potassium]);
    });
    const csvContent = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pak-nutrition-${lastReport.type}-report-${lastReport.startDate}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  }

  return { render };
})();
