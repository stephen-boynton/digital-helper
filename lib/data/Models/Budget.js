const mongoose = require("mongoose");
const moment = require("moment");

const BudgetSchema = new mongoose.Schema({
  date_created: { type: Date, default: moment() },
  current: { type: Boolean, default: true },
  gas: { type: Number, default: 100 },
  electric: { type: Number, default: 120 },
  groceries: { type: Number, default: 500 },
  home_decor: { type: Number, default: 120 },
  water: { type: Number, default: 50 },
  date_night: { type: Number, default: 200 },
  total_savings: { type: Number, default: 1000 },
  unexpected: { type: Number, default: 0 }
});

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
