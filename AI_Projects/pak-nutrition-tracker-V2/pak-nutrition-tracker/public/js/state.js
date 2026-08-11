// Shared application state + utility helpers
const AppState = {
  profile: null,
  todayISO: () => new Date().toISOString().slice(0, 10),
  selectedDate: new Date().toISOString().slice(0, 10),
  foodsCache: null,
  categories: [],
};

function fmt(n, decimals = 0) {
  if (n == null || isNaN(n)) return "0";
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function goalLabel(goal) {
  const map = {
    // current taxonomy
    fat_loss: "Fat Loss",
    weight_loss: "Weight Loss",
    maintenance: "Maintenance",
    lean_bulk: "Lean Bulk",
    muscle_gain: "Muscle Gain",
    // legacy values (older saved profiles)
    lose_weight: "Weight Loss",
    lose_fat: "Fat Loss",
    maintain: "Maintenance",
    gain_muscle: "Muscle Gain",
    gain_weight: "Lean Bulk",
  };
  return map[goal] || goal;
}

function activityLabel(level) {
  const map = {
    sedentary: "Sedentary",
    light: "Light Activity",
    moderate: "Moderate Activity",
    heavy: "Heavy Activity",
    athlete: "Athlete",
  };
  return map[level] || level;
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const colors = {
    success: "bg-leaf-500",
    error: "bg-red-500",
    info: "bg-sapphire-600",
  };
  const toast = document.createElement("div");
  toast.className = `${colors[type] || colors.info} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-soft animate-in flex items-center gap-2`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity .3s ease, transform .3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

async function loadProfile() {
  const data = await Api.get("/profile");
  AppState.profile = data.profile;
  return data.profile;
}

function svgIcon(name, size = 18) {
  const icons = {
    dashboard: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
    calculator: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 19h1M12 19h1M16 19h1" stroke-linecap="round"/></svg>`,
    tracker: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8Z"/><path d="M9 10.5l2 2 4-4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    foods: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 3v8M11 3c-2 0-3 1.5-3 3.5S9 11 11 11M8 3v4M14 3c2.5 0 4 2 4 5s-1 5-2 6v7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="19" r="0" /></svg>`,
    history: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7" stroke-linecap="round"/><path d="M3 4v5h5M12 7v5l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    progress: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18" stroke-linecap="round"/><path d="M7 15l4-5 3 3 5-7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    reports: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h8l4 4v14H7z" stroke-linejoin="round"/><path d="M9 12h6M9 16h6M9 8h2" stroke-linecap="round"/></svg>`,
    settings: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>`,
    trash: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    star: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9Z" stroke-linejoin="round"/></svg>`,
    starOutline: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9Z" stroke-linejoin="round"/></svg>`,
    water: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.5s7 7.4 7 12.5a7 7 0 1 1-14 0c0-5.1 7-12.5 7-12.5Z" stroke-linejoin="round"/></svg>`,
    walk: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13" cy="4" r="2"/><path d="M10 22l2-6 2 2 3 4M9 15l1-5-3-2 1-4 5 1 2 4h3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    weight: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 15c1-2 2-2 3-2s2 0 3 2M9.5 9.5l1 1M14.5 9.5l-1 1" stroke-linecap="round"/></svg>`,
    fire: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2s-1.5 3.5-1.5 5.5c0 1 .5 1.5 1 2 .3-1 .8-1.7 1.5-2.3.2 1 .7 1.6 1.5 2.3.9.8 1.5 1.8 1.5 3.5a4 4 0 0 1-8 0c0-2.5 1.5-4 2-6.5.3-1.5 1-3 2-4.5Z" stroke-linejoin="round"/></svg>`,
    search: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3" stroke-linecap="round"/></svg>`,
    download: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    print: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6M6 18h12v4H6v-4ZM4 9h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2v-3H6v3H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z" stroke-linejoin="round"/></svg>`,
    ruler: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15.5 15.5 4l4.5 4.5L8.5 20 4 15.5Z" stroke-linejoin="round"/><path d="m8 12 2 2M11 9l2 2M14 6l2 2" stroke-linecap="round"/></svg>`,
  };
  return icons[name] || "";
}
