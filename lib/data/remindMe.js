const { RemindMe } = require('./Models');
const mongooseClient = require('./database');
const moment = require('moment');

function addRemindMe(reminder) {
  const remindMe = new RemindMe({
    reminder: reminder.reminder,
    sender: {
      name: reminder.sender.name,
      mobile: reminder.sender.mobile
    },
    reminder_date: reminder.reminder_date,
    original_time: reminder.original_time,
    full_message: reminder.full_message
  });
  remindMe.save();
}

async function getRemindMes() {
  return await RemindMe.find({ executed: false })
    .then((err, data) => data || err)
    .catch(err => console.error(err));
}

async function updateExecuted(arrayOfIDs) {
  try {
    for (let i = 0; i <= arrayOfIDs.length; i++) {
      const id = arrayOfIDs[i];
      await RemindMe.update({ _id: id }, { $set: { executed: true } }).then(
        resp => resp
      );
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = { addRemindMe, getRemindMes, updateExecuted };
