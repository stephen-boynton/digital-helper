const mongoose = require("mongoose");
const moment = require("moment");

const GrocerySchema = new mongoose.Schema({
  date_created: { type: Date, default: moment() },
  grocery_list: [{ type: String }],
  owner: {
    name: { type: String },
    mobile: { type: String }
  },
  experation_date: { type: Date },
  message: { type: String }
});

const Grocery = mongoose.model("Grocery", GrocerySchema);

module.exports = Grocery;
