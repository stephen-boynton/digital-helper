const sched = require("node-schedule");
const { fork } = require("child_process");

function scheduleRemindMe(reminder) {
  console.log("Parenting...");
  try {
    const reminderSpawn = fork(__dirname + "/schedRemindMe.js");
    reminderSpawn.send(reminder);
    reminderSpawn.on("message", message => {
      console.log(message);
    });
  } catch (err) {
    console.error(err);
  }
}

function scheduleChecker() {
  const checkerSpawn = fork(__dirname + "/schedChecker.js");
  checkerSpawn.on("message", message => {
    if (message.type === "remindMe") {
      message.toExecute.forEach(reminder => scheduleRemindMe(reminder));
    }
  });
}

module.exports = { scheduleRemindMe, scheduleChecker };
