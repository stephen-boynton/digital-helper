const mongoose = require('mongoose');
const moment = require('moment');

const ContactSchema = new mongoose.Schema({
  date_created: { type: Date, default: moment() },
  last_upated: { type: Date, default: moment() },
  name: { type: String, required: true },
  isAuth: { type: Boolean, default: false },
  email: { type: String },
  phone: { type: String, required: true },
  birthday: { type: Date },
  groups: [{ type: String }]
});

ContactSchema.statics.convertStringToDate = function convertStringToDate(date) {
  return moment(date);
};

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
