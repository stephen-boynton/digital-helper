const moment = require('moment');
const { wordsToNumbers } = require('words-to-numbers');
const {
  indexOf,
  gt,
  lt,
  startCase,
  drop,
  filter,
  concat,
  pipe,
  add,
  head,
  split,
  parseInt,
  last,
  reduce,
  lowerCase
} = require('lodash/fp');

class ParseDate {
  constructor() {
    this.regDays = /monday|tuesday|wednesday|thursday|friday|saturday|sunday/i;
    this.regNumWord = /one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve/i;
    this.regTimeWords = /minute|\bmin\b|hour|\bday\b|week|month|year/ig;
    this.regNoonMidnight = /noon|midnight/i;
    this.regNum = /[0-9]{1,2}/;
    this.regMinNum = /:[0-9]{1,2}/;
    this.daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    this.monthsOfYear = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    this.now = moment();
    this.dayNum = moment().day();
    this.dayString = this.daysOfWeek[this.dayNum];
    this.monthNum = moment().month();
    this.monthString = this.monthsOfYear[this.monthNum];
  }

  get getDayString() {
    return this.dayString;
  }

  get getDayNum() {
    return this.dayNum;
  }

  get getMonthString() {
    return this.monthString;
  }

  get getMonthNum() {
    return this.monthNum;
  }

  parseIntPlus(string) {
    if (string === '10') {
      return parseInt(string, 10)
    }
    const maybeNumber = parseInt(string, 10);
    return maybeNumber === 10 ? false : maybeNumber
  }

  determineWhenIndex(when) {
    return pipe(
      concat(this.daysOfWeek),
      drop(this.dayNum),
      indexOf(when),
      add(this.dayNum)
    )(this.daysOfWeek);
  }

  determineDay(message) {
    let day;
    const when = startCase(this.regDays.exec(message)[0]);
    const whenIndex = this.determineWhenIndex(when);
    if (/next/i.test(message)) {
      day = gt(this.dayNum, whenIndex)
        ? this.dayNum - whenIndex + 7
        : lt(this.dayNum, whenIndex)
          ? whenIndex - this.dayNum + 7
          : this.dayNum + 7;
    } else if (this.regDays.test(message)) {
      day = gt(this.dayNum, whenIndex)
        ? this.dayNum - whenIndex
        : lt(this.dayNum, whenIndex)
          ? whenIndex - this.dayNum
          : this.dayNum + 6;
    }
    return day;
  }

  determineByExactTime(message) {
    let isAm = /am|a.m./i.test(message);
    let hour;
    let min;
    hour =
      head(this.regNoonMidnight.exec(message)) ||
      this.parseIntPlus(head(this.regNum.exec(message)), 10) ||
      this.parseIntPlus(wordsToNumbers(head(this.regNumWord.exec(message))), 10) ||
      0;

    min = last(split(':', head(this.regMinNum.exec(message))));

    if (hour === 12 || hour === 'noon') {
      hour = 0;
    }

    if (hour === 'midnight') {
      isAm = true;
      hour = 0;
    }

    if (isAm) {
      return {
        hour: hour,
        min: min ? min : 0
      };
    } else {
      // assuming pm by default
      return {
        hour: hour + 12,
        min: min ? min : 0
      };
    }
  }

  determineByRelativeTime(message) {
    const timeWords = pipe(
      split(' '),
      filter(x => this.regTimeWords.test(x))
    )(message);

    if (/\band\b/.test(message)) {
      message = message.split(/\s+and\s+/).join(' ');
    }

    const mapOfTime = reduce((acc, time) => {
      switch (time) {
        case 'year': {
          const [year, remainder] = acc.message.split(/\s*year\s*/)
          const value = this.parseIntPlus(year) || wordsToNumbers(year);
          acc.years = value;
          acc.message = remainder;
          break;
        }
        case 'month': {
          const [month, remainder] = acc.message.split(/\s*month\s*/)
          const value = this.parseIntPlus(month) || wordsToNumbers(month);
          acc.months = value;
          acc.message = remainder;
          break;
        }
        case 'day': {
          const [day, remainder] = acc.message.split(/\s*day\s*/)
          const value = this.parseIntPlus(day) || wordsToNumbers(day);
          acc.days = value;
          acc.message = remainder;
          break;
        }
        case 'hour': {
          const [hour, remainder] = acc.message.split(/\s*hour\s*/)
          const value = this.parseIntPlus(hour) || wordsToNumbers(hour);
          acc.hours = value;
          acc.message = remainder;
          break;
        }
        case 'minute': {
          const [minute, remainder] = acc.message.split(/\s*minute\s*/)
          const value = this.parseIntPlus(minute) || wordsToNumbers(minute);
          acc.minutes = value;
          acc.message = remainder;
          break;
        }
        case 'min': {
          const [min, remainder] = acc.message.split(/\s*min\s*/)
          const value = this.parseIntPlus(min) || wordsToNumbers(min);
          acc.minutes = value;
          acc.message = remainder;
          break;
        }
        default:
          break;
      }
      return acc;
    }, { years: 0, months: 0, days: 0, hours: 0, minutes: 0, message }, timeWords);
    console.log(mapOfTime);
    return mapOfTime;
  }

  getDateFromRelativeTime(timeObj) {
    return this.now.add(timeObj);
  }

  getDateFromDayTime(day = 0, { hour, min } = {}) {
    return moment().set({
      date: moment()
        .add(day, 'd')
        .format('DD'),
      year: moment()
        .day(day)
        .format('YYYY'),
      hour: hour,
      minute: min,
      second: 0
    });
  }

  formatForCron(date) {
    return split(',', moment(date).format('YYYY,MM,DD,HH,mm,ss'));
  }

  determineByAmountAndMeasure(message) {
    const relative = last(split(' in ', message));
    const [stringAmount, fullMeasure] = split(' ', lowerCase(relative));
    const amount = wordsToNumbers(stringAmount) || parseInt(stringAmount);
    const shortMeasure = fullMeasure === 'month' ? 'M' : head(fullMeasure);
    console.log(relative, stringAmount, fullMeasure, amount, shortMeasure)
    return moment()
      .add(amount, shortMeasure)
      .toDate();
  }

  getDateTimeFromMessage(message) {
    const hasDayOfWeek = head(this.regDays.exec(message)); //?
    if (hasDayOfWeek) {
      console.log('day of week');
      const day = this.determineDay(message);
      const time = this.determineByExactTime(message);
      return this.getDateFromDayTime(day, time).toDate();
    } else if (/ in /i.test(message)) {
      return this.determineByAmountAndMeasure(message);
    } else if (this.regTimeWords.test(message)) {
      const timeObj = this.determineByRelativeTime(message);
      const reminderDate = this.getDateFromRelativeTime(timeObj);
      // console.log(this.now.toDate());
      // console.log(reminderDate);
      return reminderDate.toDate();
    } else {
      console.log('else');
      return this.getDateFromDayTime(
        undefined,
        this.determineByExactTime(message)
      ).toDate();
    }
  }

  getCronDateFromMessage(message) {
    const day = this.determineDay(message);
    const time = this.determineByExactTime(message);
    const dayAndTime = this.getDateFromDayTime(day, time);
    return this.formatForCron(dayAndTime);
  }
}

module.exports = function parseDateFactory() {
  return new ParseDate();
};
