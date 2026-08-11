const express = require("express");
const router  = express.Router();
const { prepare } = require("../db/database");
const today = () => new Date().toISOString().slice(0,10);

router.get("/", (req, res) => {
  try {
    const date = req.query.date || today();
    const meals = prepare("SELECT * FROM meal_logs WHERE log_date=? ORDER BY created_at ASC").all(date);
    res.json({ success:true, meals, date });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post("/", (req, res) => {
  try {
    const { log_date,meal_type,food_id,food_name,quantity,calories,protein,carbs,fat,fiber,sugar,sodium,potassium } = req.body;
    if (!meal_type||!food_name||quantity==null) return res.status(400).json({ success:false, error:"Missing fields" });
    if (!["breakfast","lunch","dinner","snack"].includes(meal_type)) return res.status(400).json({ success:false, error:"Invalid meal type" });
    if (quantity<=0) return res.status(400).json({ success:false, error:"Quantity must be positive" });
    const date = log_date || today();
    const result = prepare(`INSERT INTO meal_logs
      (log_date,meal_type,food_id,food_name,quantity,calories,protein,carbs,fat,fiber,sugar,sodium,potassium)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(date,meal_type,food_id||null,food_name,+quantity,+calories||0,+protein||0,+carbs||0,+fat||0,+fiber||0,+sugar||0,+sodium||0,+potassium||0);
    const inserted = prepare("SELECT * FROM meal_logs WHERE id=?").get(result.lastInsertRowid);
    res.json({ success:true, meal:inserted });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.delete("/:id", (req, res) => {
  try {
    prepare("DELETE FROM meal_logs WHERE id=?").run(+req.params.id);
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

module.exports = router;
