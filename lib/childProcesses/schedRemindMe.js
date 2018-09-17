const sched = require("node-schedule");
const { reminderMessage } = require("../communication");

process.send("Child process is active...");
process.on("message", async reminder => {
  process.send(`Child proccess is scheduling reminder...`);
  try {
    await sched.scheduleJob(reminder.reminder_date, async () => {
      await reminderMessage(reminder);
      process.send("I'm done");
      process.exit();
    });
  } catch (err) {
    process.send(err);
  }
});
