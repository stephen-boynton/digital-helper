const { REMIND_ME, GROCERIES, BUDGET } = require('../utils/constants').SERVICES;

module.exports = new Map([
  [/remind me/i, REMIND_ME],
  [/budget|i spent/i, BUDGET],
  [/grocery|groceries|grocery list/i, GROCERIES]
]);
