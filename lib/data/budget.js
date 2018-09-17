const mongooseClient = require('./database');
const { Budget } = require('./Models');

async function getCurrent() {
  return await Budget.findOne(
    { current: true },
    {
      _id: 0,
      gas: 1,
      electric: 1,
      groceries: 1,
      home_decor: 1,
      water: 1,
      date_night: 1,
      total_savings: 1,
      unexpected: 1
    }
  ).then(res => res);
}

async function newBudget() {
  await Budget.findOneAndUpdate(
    { current: true },
    { $set: { current: false } }
  );
  const budget = await new Budget();
  await budget.save();
  return await getCurrent();
}

async function newCustomBudget(customBudget) {
  await Budget.findOneAndUpdate(
    { current: true },
    { $set: { current: false } }
  );
  console.log('customeBudget', customBudget);
  const budget = await new Budget(customBudget);
  budget.save();
  return await getCurrent();
}

async function updateIndividualBudgetAmount({ budgetItem, updateBy }) {
  try {
    const update = await Budget.findOneAndUpdate(
      { current: true },
      { $inc: { [budgetItem]: updateBy } }
    ).then(resp => resp);
    return update;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  updateIndividualBudgetAmount,
  newBudget,
  getCurrent,
  newCustomBudget
};
