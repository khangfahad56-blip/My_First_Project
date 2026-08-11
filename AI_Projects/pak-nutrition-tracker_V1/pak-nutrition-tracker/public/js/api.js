// Thin wrapper around fetch for the Pak Nutrition Tracker API
const Api = (() => {
  async function request(path, options = {}) {
    try {
      const res = await fetch(`/api${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || `Request failed: ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API error [${path}]:`, err.message);
      throw err;
    }
  }

  return {
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body || {}) }),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body || {}) }),
    del: (path) => request(path, { method: "DELETE" }),
  };
})();
