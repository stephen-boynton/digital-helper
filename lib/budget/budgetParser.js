const {
  handleGetBudget,
  handleISpent,
  handleStartNewBudget,
  handleAddToBudget
} = require('./handler');

module.exports = async function budgetParser(textObj) {
  const { message } = textObj;

  if (message.startsWith('Add ') || message.startsWith('add ')) {
    await handleAddToBudget(textObj);
  }

  if (message.startsWith('Get budget') || message.startsWith('get budget')) {
    await handleGetBudget(textObj);
  }

  if (
    message.startsWith('start new budget') ||
    message.startsWith('Start new budget')
  ) {
    await handleStartNewBudget(textObj);
  }

  if (message.startsWith('I spent') || message.startsWith('i spent')) {
    await handleISpent(textObj);
  }
  return true;
};
