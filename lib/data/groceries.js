const mongooseConnection = require("./database");
const { Groceries } = require("./Models");

async function saveNewGroceryList(groceryObject) {
  const groceries = await new Groceries({});
}
