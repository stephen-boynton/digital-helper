const moment = require('moment');
const { wordsToNumbers } = require('words-to-numbers');
const {
  indexOf,
  gt,
  lt,
  startCase,
  drop,
  concat,
  pipe,
  add,
  head,
  split,
  parseInt,
  last,
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

  determineTime(message) {
    let isAm = /am|a.m./i.test(message);
    const timeWord = this.regTimeWords.exec(message);
    console.log(timeWord);
    let hour;
    let min;

    // if (timeWord === 'hour') {
    //   hour = split(/ hour/, message);
    // } else {
    hour =
      head(this.regNoonMidnight.exec(message)) ||
      this.parseIntPlus(head(this.regNum.exec(message)), 10) ||
      this.parseIntPlus(wordsToNumbers(head(this.regNumWord.exec(message))), 10) ||
      0;
    // }
    min = last(split(':', head(this.regMinNum.exec(message)))) ||
      first(split(' min'));

    if (hour === 12 || hour === 'noon') {
      hour = 0;
    }

    if (hour === 'midnight') {
      isAm = true;
      hour = 0;
    }

    console.log(hour, min)

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
      const time = this.determineTime(message);
      return this.getDateFromDayTime(day, time).toDate();
    } else if (/ in /i.test(message)) {
      return this.determineByAmountAndMeasure(message);
    } else {
      console.log('else');
      return this.getDateFromDayTime(
        undefined,
        this.determineTime(message)
      ).toDate();
    }
  }

  getCronDateFromMessage(message) {
    const day = this.determineDay(message);
    const time = this.determineTime(message);
    const dayAndTime = this.getDateFromDayTime(day, time);
    return this.formatForCron(dayAndTime);
  }
}

module.exports = function parseDateFactory() {
  return new ParseDate();
};

