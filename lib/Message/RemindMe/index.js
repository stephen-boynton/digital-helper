const { split, head, last, cond, compact, T } = require('lodash/fp');
const { demethodize } = require('../../utils/fp');
const createParseDate = require('../../ParseDate');

const rgexTest = demethodize(RegExp.prototype.test, 2);
const rgexExec = demethodize(RegExp.prototype.exec, 2);
const parseDate = createParseDate();

class RemindMe {
  constructor(message) {
    this.message = message;
    this.regRemindMeIn = /remind me in /i;
    this.regRemindMeTo = /remind me to /i;
    this.regRemindMeOn = /remind me on /i;
    this.regRemindMeAt = /remind me at /i;
    this.regPrep = / on | in | next /i;
    this.reminder = null;
    this.original_time = null;
    this.reminder_date = null;
  }

  splitRemindMeIn(message) {
    const [original_time, reminder] = split(
      ' to ',
      last(split('remind me in ', message))
    );
    return {
      original_time,
      reminder
    };
  }

  splitRemindMeOn(message) {
    const [original_time, reminder] = split(
      ' to ',
      last(split('remind me on ', message))
    );
    return {
      original_time,
      reminder
    };
  }

  splitRemindMeTo(message) {
    const part = last(split('remind me to ', message));
    const prep = head(compact(rgexExec(this.regPrep, part)));
    const [reminder, original_time] = split(prep, part);

    return {
      original_time,
      reminder
    };
  }

  splitRemindMeAt(message) {
    const [original_time, reminder] = split(
      ' to ',
      last(split('remind me at ', message)) //?
    ); //?
    return {
      original_time,
      reminder
    };
  }

  parse() {
    const { original_time, reminder, wildcard } = cond([
      [rgexTest(this.regRemindMeIn), this.splitRemindMeIn.bind(this)],
      [rgexTest(this.regRemindMeOn), this.splitRemindMeOn.bind(this)],
      [rgexTest(this.regRemindMeTo), this.splitRemindMeTo.bind(this)],
      [rgexTest(this.regRemindMeAt), this.splitRemindMeAt.bind(this)],
      [T, m => ({ wildcard: m })]
    ])(this.message); //?
    const reminder_date = parseDate.getDateTimeFromMessage(
      original_time || reminder || wildcard
    );
    this.reminder = reminder;
    this.original_time = original_time;
    this.reminder_date = reminder_date;
    this.full_message = this.message;
    return this;
  }

  toObject() {
    return {
      scheduler_type: 'remind_me',
      reminder: this.reminder,
      original_time: this.original_time,
      reminder_date: this.reminder_date,
      full_message: this.full_message
    };
  }
}

module.exports = function createRemindMe(message) {
  return new RemindMe(message);
};
