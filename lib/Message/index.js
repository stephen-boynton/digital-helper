const determineSender = require('./determineSender');
const createRemindMe = require('./RemindMe');
const { sendConfirmation } = require('../communication');
const { remindMe: { addRemindMe } } = require('../data');
const { scheduleRemindMe } = require('../childProcesses');
const { withinFive } = require('../utils');
class Message {
  constructor({ From: from, Body: message = '' }) {
    this.sender = determineSender(from);
    this.message = message.toLowerCase();
  }

  async remindMe() {
    const rm = createRemindMe(this.message);
    const reminder = rm.parse().toObject();
    reminder.sender = this.sender;
    // console.log(reminder);
    // await sendConfirmation(reminder);
    if (withinFive(reminder.reminder_date)) {
      console.log('Scheduling reminder...!');
      scheduleRemindMe(reminder);
    } else {
      console.log('saving to the database');
      // await addRemindMe(reminder);
    }
  }
}

module.exports = function createMessage(body) {
  return new Message(body);
};
