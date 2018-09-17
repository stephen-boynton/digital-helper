const determineSender = require('./determineSender');
const createRemindMe = require('./RemindMe');
const { sendConfirmation } = require('../communication');
const { remindMe } = require('../data');
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
    await sendConfirmation(reminder);
    if (withinFive(reminder.reminder_date)) {
      console.log('Scheduling reminder...!');
      scheduleRemindMe(reminder);
    } else {
      console.log('saving to the database');
      await remindMe(reminder);
    }
  }
}

module.exports = function createMessage(body) {
  return new Message(body);
};
