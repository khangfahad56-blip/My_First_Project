const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");
const today   = () => new Date().toISOString().slice(0,10);

router.get("/", (req, res) => {
  try {
    const limit = parseInt(req.query.limit)||90;
    // sql.js doesn't support named params in LIMIT, use string concat safely (limit is numeric)
    const logs = prepare(`SELECT * FROM weight_logs ORDER BY log_date ASC LIMIT ${limit}`).all();
    res.json({ success:true, logs });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post("/", (req, res) => {
  try {
    const { weight_kg, log_date } = req.body;
    if (!weight_kg||+weight_kg<=0||+weight_kg>500) return res.status(400).json({ success:false, error:"Invalid weight" });
    const date = log_date || today();
    const existing = prepare("SELECT id FROM weight_logs WHERE log_date=?").get(date);
    if (existing) prepare("UPDATE weight_logs SET weight_kg=? WHERE id=?").run(+weight_kg, existing.id);
    else          prepare("INSERT INTO weight_logs (log_date,weight_kg) VALUES (?,?)").run(date, +weight_kg);
    prepare("UPDATE profile SET weight_kg=? WHERE id=1").run(+weight_kg);
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get("/measurements", (req, res) => {
  try {
    const limit = parseInt(req.query.limit)||90;
    const logs = prepare(`SELECT * FROM body_measurements ORDER BY log_date ASC LIMIT ${limit}`).all();
    res.json({ success:true, logs });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post("/measurements", (req, res) => {
  try {
    const { chest_cm,waist_cm,hips_cm,arm_cm,thigh_cm,body_fat_pct,log_date } = req.body;
    const date = log_date || today();
    const existing = prepare("SELECT id FROM body_measurements WHERE log_date=?").get(date);
    if (existing) {
      prepare(`UPDATE body_measurements SET chest_cm=?,waist_cm=?,hips_cm=?,arm_cm=?,thigh_cm=?,body_fat_pct=? WHERE id=?`)
        .run(chest_cm||null,waist_cm||null,hips_cm||null,arm_cm||null,thigh_cm||null,body_fat_pct||null,existing.id);
    } else {
      prepare(`INSERT INTO body_measurements (log_date,chest_cm,waist_cm,hips_cm,arm_cm,thigh_cm,body_fat_pct) VALUES (?,?,?,?,?,?,?)`)
        .run(date,chest_cm||null,waist_cm||null,hips_cm||null,arm_cm||null,thigh_cm||null,body_fat_pct||null);
    }
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
