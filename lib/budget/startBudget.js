const { newBudget, newCustomBudget } = require('../data').budget;
const createCustomBudget = require('./createCustomBudget');

module.exports = async function startBudget({ message }) {
  let returnBudget;
  if (message.indexOf(' with ') > -1) {
    customBudget = createCustomBudget(message);
    returnBudget = await newCustomBudget(customBudget);
  } else {
    returnBudget = await newBudget();
  }
  console.log('return budget', returnBudget);
  return returnBudget;
};
