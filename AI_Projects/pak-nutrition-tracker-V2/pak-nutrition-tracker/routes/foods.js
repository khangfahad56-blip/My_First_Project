const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");

router.get("/categories", (req, res) => {
  try {
    const rows = prepare("SELECT DISTINCT category FROM foods ORDER BY category ASC").all();
    res.json({ success:true, categories: rows.map(r => r.category) });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get("/favorites/list", (req, res) => {
  try {
    const rows = prepare("SELECT food_id FROM favorites").all();
    res.json({ success:true, favoriteIds: rows.map(r => r.food_id) });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get("/history/recent", (req, res) => {
  try {
    const rows = prepare("SELECT DISTINCT query FROM search_history ORDER BY created_at DESC LIMIT 10").all();
    res.json({ success:true, history: rows.map(r => r.query) });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post("/history/recent", (req, res) => {
  try {
    const { query } = req.body;
    if (query && query.trim().length > 0)
      prepare("INSERT INTO search_history (query) VALUES (?)").run(query.trim());
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get("/:id/favorite-status", (req, res) => {
  try {
    const row = prepare("SELECT id FROM favorites WHERE food_id = ?").get(req.params.id);
    res.json({ success:true, favorited: !!row });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post("/:id/favorite", (req, res) => {
  try {
    const foodId = parseInt(req.params.id);
    const existing = prepare("SELECT id FROM favorites WHERE food_id = ?").get(foodId);
    if (existing) {
      prepare("DELETE FROM favorites WHERE food_id = ?").run(foodId);
      return res.json({ success:true, favorited:false });
    } else {
      prepare("INSERT INTO favorites (food_id) VALUES (?)").run(foodId);
      return res.json({ success:true, favorited:true });
    }
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get("/:id", (req, res) => {
  try {
    const food = prepare("SELECT * FROM foods WHERE id = ?").get(parseInt(req.params.id));
    if (!food) return res.status(404).json({ success:false, error:"Food not found" });
    res.json({ success:true, food });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get("/", (req, res) => {
  try {
    const { search, category, favoritesOnly } = req.query;
    let query = "SELECT f.* FROM foods f";
    const conditions = [];
    const params = [];

    if (favoritesOnly === "true") query += " INNER JOIN favorites fav ON fav.food_id = f.id";
    if (search)  { conditions.push("f.name LIKE ?"); params.push(`%${search}%`); }
    if (category && category !== "all") { conditions.push("f.category = ?"); params.push(category); }
    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY f.name ASC LIMIT 500";

    const foods = prepare(query).all(...params);
    res.json({ success:true, foods });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
