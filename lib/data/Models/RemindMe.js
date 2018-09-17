const mongoose = require('mongoose');
const moment = require('moment');

const RemindMeSchema = new mongoose.Schema({
  date_created: { type: Date, default: moment() },
  reminder: { type: String },
  sender: {
    name: { type: String },
    mobile: { type: String }
  },
  reminder_date: { type: Date },
  original_time: { type: String },
  executed: { type: Boolean, default: false },
  full_message: { type: String }
});

const RemindMe = mongoose.model('RemindMe', RemindMeSchema);

module.exports = RemindMe;
