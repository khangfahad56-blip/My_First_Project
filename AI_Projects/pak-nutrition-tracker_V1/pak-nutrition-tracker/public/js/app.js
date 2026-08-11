// Main app controller: navigation, theming, page lifecycle
const App = (() => {
  const PAGES = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", controller: () => Dashboard.render() },
    { key: "calculator", label: "Calculator", icon: "calculator", controller: () => Calculator.render() },
    { key: "tracker", label: "Meal Tracker", icon: "tracker", controller: () => Tracker.render() },
    { key: "foods", label: "Food Database", icon: "foods", controller: () => Foods.render() },
    { key: "history", label: "History", icon: "history", controller: () => History.render() },
    { key: "progress", label: "Progress", icon: "progress", controller: () => Progress.render() },
    { key: "reports", label: "Reports", icon: "reports", controller: () => Reports.render() },
    { key: "settings", label: "Settings & Goals", icon: "settings", controller: () => Settings.render() },
  ];
  let currentPage = "dashboard";

  function buildNav() {
    const navHTML = PAGES.map((p) => `
      <button class="nav-link w-full text-left ${p.key === currentPage ? "active" : ""}" data-page="${p.key}">
        ${svgIcon(p.icon, 17)}
        <span>${p.label}</span>
      </button>
    `).join("");
    document.getElementById("main-nav").innerHTML = navHTML;
    document.getElementById("mobile-nav").innerHTML = navHTML;

    document.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => navigate(btn.dataset.page));
    });
  }

  function navigate(page) {
    currentPage = page;
    document.querySelectorAll(".page-section").forEach((sec) => sec.classList.add("hidden"));
    document.getElementById(`section-${page}`).classList.remove("hidden");
    document.querySelectorAll("[data-page]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === page);
    });
    document.getElementById("mobile-nav").classList.add("hidden");

    const pageDef = PAGES.find((p) => p.key === page);
    if (pageDef) pageDef.controller();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setupTheme() {
    const stored = localStorageSafeGet("pnt-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    applyTheme(isDark);

    document.getElementById("theme-toggle").addEventListener("click", () => {
      const nowDark = !document.documentElement.classList.contains("dark");
      applyTheme(nowDark);
      localStorageSafeSet("pnt-theme", nowDark ? "dark" : "light");
      // Redraw progress charts if that's the current page (theme-aware colors)
      if (currentPage === "progress") Progress.render();
    });
  }

  function applyTheme(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    document.getElementById("theme-label").textContent = isDark ? "Dark mode" : "Light mode";
  }

  // Safe localStorage wrappers (some sandboxed contexts disallow storage access)
  function localStorageSafeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function localStorageSafeSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  }

  function setupMobileNav() {
    document.getElementById("mobile-nav-toggle").addEventListener("click", () => {
      document.getElementById("mobile-nav").classList.toggle("hidden");
    });
  }

  async function init() {
    setupTheme();
    setupMobileNav();
    try {
      await loadProfile();
    } catch (err) {
      console.error("Failed to load profile", err);
    }
    buildNav();
    navigate("dashboard");
  }

  return { navigate, init };
})();

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
