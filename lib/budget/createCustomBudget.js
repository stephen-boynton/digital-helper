const budgetItemConversion = require('./utility/budgetItemConversion');

module.exports = function createCustomBudget(message) {
  const messageToParse = message.split(' with ')[1];
  const newBudgetArray = messageToParse.split(', ');
  const newBudgetObject = newBudgetArray.reduce((budget, item) => {
    const [beginning, middle, end] = item.split(' ');
    const lineItem = end
      ? `${beginning}_${middle}`
      : budgetItemConversion(beginning);
    budget[lineItem] = end ? parseInt(end) : parseInt(middle);
    return Object.assign({}, budget);
  }, {});
  return newBudgetObject;
};
