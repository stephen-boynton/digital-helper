const { updateIndividualBudgetAmount, getCurrent } = require('../data').budget;
const { lowerCase, pick } = require('lodash');
const budgetItemConversion = require('./utility/budgetItemConversion.js');

module.exports = async function addToBudget(message) {
  const lowerCaseMessage = lowerCase(message);
  const [updateBy, protoItem] = lowerCaseMessage.split('add ')[1].split(' to ');
  const budgetItem = budgetItemConversion(
    protoItem.split(' budget')[0]
  ).replace(' ', '_');
  await updateIndividualBudgetAmount({ updateBy, budgetItem });
  return pick(await getCurrent(), budgetItem);
};
