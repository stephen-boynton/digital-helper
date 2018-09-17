const { getCurrent } = require("../data").budget;
const { omit } = require("lodash");

module.exports = async function retrieveEntireBudget() {
  const budget = await getCurrent();
  return budget;
};
