// Progress page: charts for calories, macros, weight, walking (Chart.js)
const Progress = (() => {
  let charts = {};
  let range = "week";

  async function render() {
    const el = document.getElementById("section-progress");
    el.innerHTML = `<div class="animate-pulse-soft text-sapphire-400 text-sm py-12 text-center">Loading charts…</div>`;
    await draw();
  }

  async function draw() {
    const el = document.getElementById("section-progress");
    const [historyRes, weightRes, profileRes] = await Promise.all([
      Api.get(`/dashboard/history?range=${range}`),
      Api.get(`/weight?limit=60`),
      Api.get(`/profile`),
    ]);

    Object.values(charts).forEach((c) => c && c.destroy());
    charts = {};

    el.innerHTML = `
      <div class="animate-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 class="font-display font-700 text-2xl text-sapphire-800 dark:text-white">Progress</h2>
            <p class="text-sapphire-400 dark:text-sapphire-300 text-sm mt-1">Trends over time.</p>
          </div>
          <div class="flex gap-1.5">
            ${rangeBtn("week", "7 Days")}
            ${rangeBtn("month", "30 Days")}
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-5">
          <div class="card p-5">
            <h3 class="font-display font-600 text-sm text-sapphire-700 dark:text-white mb-3">Daily Calories</h3>
            <canvas id="chart-calories" height="200"></canvas>
          </div>
          <div class="card p-5">
            <h3 class="font-display font-600 text-sm text-sapphire-700 dark:text-white mb-3">Macros (Protein / Fat / Carbs)</h3>
            <canvas id="chart-macros" height="200"></canvas>
          </div>
          <div class="card p-5">
            <h3 class="font-display font-600 text-sm text-sapphire-700 dark:text-white mb-3">Weight Trend</h3>
            <canvas id="chart-weight" height="200"></canvas>
          </div>
          <div class="card p-5">
            <h3 class="font-display font-600 text-sm text-sapphire-700 dark:text-white mb-3">Walking (kcal burned)</h3>
            <canvas id="chart-walking" height="200"></canvas>
          </div>
          <div class="card p-5">
            <h3 class="font-display font-600 text-sm text-sapphire-700 dark:text-white mb-3">BMI Over Time</h3>
            <canvas id="chart-bmi" height="200"></canvas>
          </div>
          <div class="card p-5">
            <h3 class="font-display font-600 text-sm text-sapphire-700 dark:text-white mb-3">Est. Body Fat % Over Time</h3>
            <canvas id="chart-bodyfat" height="200"></canvas>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll(".range-btn-progress").forEach((btn) => {
      btn.addEventListener("click", () => {
        range = btn.dataset.range;
        draw();
      });
    });

    const labels = historyRes.meals.map((m) => fmtDate(m.log_date));
    const gridColor = document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.06)" : "rgba(27,75,115,0.06)";
    const textColor = document.documentElement.classList.contains("dark") ? "#9fb8cf" : "#5b7083";

    Chart.defaults.font.family = "Inter, sans-serif";
    Chart.defaults.color = textColor;

    charts.calories = new Chart(document.getElementById("chart-calories"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Calories",
          data: historyRes.meals.map((m) => Math.round(m.calories)),
          backgroundColor: "#2e78b3",
          borderRadius: 6,
        }],
      },
      options: baseOptions(gridColor),
    });

    charts.macros = new Chart(document.getElementById("chart-macros"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Protein (g)", data: historyRes.meals.map((m) => Math.round(m.protein)), borderColor: "#2e86ab", backgroundColor: "#2e86ab33", tension: 0.35, fill: true },
          { label: "Fat (g)", data: historyRes.meals.map((m) => Math.round(m.fat)), borderColor: "#e8a33d", backgroundColor: "#e8a33d33", tension: 0.35, fill: true },
          { label: "Carbs (g)", data: historyRes.meals.map((m) => Math.round(m.carbs)), borderColor: "#2f9e44", backgroundColor: "#2f9e4433", tension: 0.35, fill: true },
        ],
      },
      options: baseOptions(gridColor),
    });

    const weightLabels = weightRes.logs.map((w) => fmtDate(w.log_date));
    charts.weight = new Chart(document.getElementById("chart-weight"), {
      type: "line",
      data: {
        labels: weightLabels,
        datasets: [{ label: "Weight (kg)", data: weightRes.logs.map((w) => w.weight_kg), borderColor: "#1b4b73", backgroundColor: "#1b4b7322", tension: 0.35, fill: true, pointRadius: 3 }],
      },
      options: baseOptions(gridColor),
    });

    charts.walking = new Chart(document.getElementById("chart-walking"), {
      type: "bar",
      data: {
        labels: historyRes.walking.map((w) => fmtDate(w.log_date)),
        datasets: [{ label: "Calories Burned", data: historyRes.walking.map((w) => Math.round(w.calories || 0)), backgroundColor: "#2f9e44", borderRadius: 6 }],
      },
      options: baseOptions(gridColor),
    });

    const profile = profileRes.profile;
    const bmiSeries = weightRes.logs.map((w) => (w.weight_kg / ((profile.height_cm / 100) ** 2)));
    charts.bmi = new Chart(document.getElementById("chart-bmi"), {
      type: "line",
      data: {
        labels: weightLabels,
        datasets: [{ label: "BMI", data: bmiSeries.map((v) => Math.round(v * 10) / 10), borderColor: "#e8a33d", backgroundColor: "#e8a33d22", tension: 0.35, fill: true, pointRadius: 3 }],
      },
      options: baseOptions(gridColor),
    });

    const bodyFatSeries = weightRes.logs.map((w) => {
      const bmiV = w.weight_kg / ((profile.height_cm / 100) ** 2);
      return 1.2 * bmiV + 0.23 * profile.age - 10.8 * (profile.gender === "female" ? 0 : 1) - 5.4;
    });
    charts.bodyfat = new Chart(document.getElementById("chart-bodyfat"), {
      type: "line",
      data: {
        labels: weightLabels,
        datasets: [{ label: "Body Fat %", data: bodyFatSeries.map((v) => Math.round(v * 10) / 10), borderColor: "#2e78b3", backgroundColor: "#2e78b322", tension: 0.35, fill: true, pointRadius: 3 }],
      },
      options: baseOptions(gridColor),
    });
  }

  function baseOptions(gridColor) {
    return {
      responsive: true,
      plugins: { legend: { display: true, labels: { boxWidth: 10, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { font: { size: 10 } } },
        y: { grid: { color: gridColor }, ticks: { font: { size: 10 } }, beginAtZero: true },
      },
    };
  }

  function rangeBtn(key, label) {
    return `<button class="seg-btn range-btn-progress ${range === key ? "active" : ""}" data-range="${key}">${label}</button>`;
  }

  return { render };
})();
