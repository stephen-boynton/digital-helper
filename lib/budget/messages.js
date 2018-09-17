const { startCase } = require('lodash');

function parseBudget(budgetObj) {
  return Object.keys(budgetObj).reduce((acc, item) => {
    acc += `\n${startCase(item)}: ${budgetObj[item]}`;
    return acc;
  }, ``);
}

function buildStartBudgetMessage(budgetObj) {
  console.log(budgetObj);
  return `Here's this month's new budget:
    ${parseBudget(budgetObj)}`;
}

function buildSpentOrAdd(budgetObj) {
  return `Sure thing. Here's your new total -- ${parseBudget(budgetObj)}`;
}

function buildGetBudget(budgetObj) {
  return `Here's your current budget:
    ${parseBudget(budgetObj._doc)}`;
}

module.exports = {
  buildStartBudgetMessage,
  buildSpentOrAdd,
  buildGetBudget
};
