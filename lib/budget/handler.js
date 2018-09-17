const startBudget = require('./startBudget');
const { genericMessage } = require('../communication');
const addToBudget = require('./addToBudget');
const {
  buildStartBudgetMessage,
  buildSpentOrAdd,
  buildGetBudget
} = require('./messages');

const { parseISpent } = require('./iSpent');
const { getCurrent } = require('../data').budget;

async function handleStartNewBudget(textObj) {
  const budget = await startBudget(textObj);
  const reply = budget._doc
    ? buildStartBudgetMessage(budget._doc)
    : buildStartBudgetMessage(budget);
  await genericMessage({ sender: textObj.sender, message: reply });
}

async function handleISpent(textObj) {
  const updatedBudgetItem = await parseISpent(textObj.message);
  console.log(updatedBudgetItem);
  const reply = buildSpentOrAdd(updatedBudgetItem);
  await genericMessage({ sender: textObj.sender, message: reply });
}

async function handleGetBudget(textObj) {
  const currentBudget = await getCurrent();
  const reply = buildGetBudget(currentBudget);
  await genericMessage({ sender: textObj.sender, message: reply });
}

async function handleAddToBudget(textObj) {
  const updatedItem = await addToBudget(textObj.message);
  const reply = buildSpentOrAdd(updatedItem);
  await genericMessage({ sender: textObj.sender, message: reply });
}

module.exports = {
  handleGetBudget,
  handleISpent,
  handleStartNewBudget,
  handleAddToBudget
};
