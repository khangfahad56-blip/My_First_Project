// Pak Nutrition Tracker — Express server (sql.js edition, no native compilation needed)
const express = require("express");
const cors    = require("cors");
const path    = require("path");
const { initDatabase } = require("./db/database");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/foods",      require("./routes/foods"));
app.use("/api/profile",    require("./routes/profile"));
app.use("/api/meals",      require("./routes/meals"));
app.use("/api/water",      require("./routes/water"));
app.use("/api/walking",    require("./routes/walking"));
app.use("/api/weight",     require("./routes/weight"));
app.use("/api/dashboard",  require("./routes/dashboard"));

app.get("/api/health", (_req, res) => res.json({ success:true, status:"ok", app:"Pak Nutrition Tracker" }));

// SPA fallback — serve index.html for any non-API route
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success:false, error:"Internal server error" });
});

// Database initialises asynchronously, then server starts
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🥗  Pak Nutrition Tracker  →  http://localhost:${PORT}\n`);
  });
}).catch(err => {
  console.error("Failed to initialise database:", err);
  process.exit(1);
});
