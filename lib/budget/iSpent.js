const { lowerCase, pick } = require('lodash');
const { updateIndividualBudgetAmount, getCurrent } = require('../data').budget;

async function parseISpent(message) {
  const lowerCaseMessage = lowerCase(message);
  const [amount, protoItem] = lowerCaseMessage
    .split('i spent ')[1]
    .split(' on ');
  const budgetItem = protoItem.replace(' ', '_');
  const updateBy = amount * -1;

  await updateIndividualBudgetAmount({ updateBy, budgetItem });
  return pick(await getCurrent(), budgetItem);
}

module.exports = {
  parseISpent
};
