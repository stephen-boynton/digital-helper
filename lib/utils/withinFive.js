const moment = require("moment");

module.exports = function withinFive(execDate) {
  const now = moment();
  const inFive = moment(now).add(5, "m");
  if (moment(execDate).isAfter(now) && moment(execDate).isBefore(inFive)) {
    return true;
  }
  return false;
};
