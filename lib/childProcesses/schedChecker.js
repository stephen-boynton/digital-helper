const sched = require("node-schedule");
const {
  remindMe: { getRemindMes, updateExecuted }
} = require("../data");
const { withinFive } = require("../utils");

console.log("Scheduler running...");

async function checkRemindMes() {
  const idArray = [];
  try {
    const remindMes = await getRemindMes();
    if (remindMes.length) {
      const toExecute = remindMes.filter(
        rem => (withinFive(rem.reminder_date) ? rem : null)
      );

      toExecute.forEach(doc => idArray.push(doc._id));
      await updateExecuted(idArray);
      return {
        type: "remindMe",
        toExecute
      };
    }
    return null;
  } catch (err) {
    console.error(err);
  }
}

sched.scheduleJob("*/1 * * * *", async () => {
  process.send("Checking database...");
  try {
    const remindMes = await checkRemindMes();
    if (remindMes) {
      process.send(remindMes);
    }
  } catch (err) {
    console.error(err);
  }
});
