const {
  TWILIO_AUTH,
  TWILIO_ACCOUNT,
  TWILIO_PHONE,
  ERIN,
  STEPHEN
} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT, TWILIO_AUTH);

async function sendWeeklyEvents(eventObj) {
  const response = await client.messages
    .create(
      {
        to: STEPHEN,
        from: TWILIO_PHONE,
        body: `Hey, Erin and Stephen! Looking at the week ahead you have ${
          eventObj.total_items
        } this week: ${makeEventList(eventObj.events)}`
      },
      function(error, message) {
        if (!error) {
          console.log('Message sent on:');
          console.log(message.dateCreated);
        } else {
          console.error(error);
          console.log('Oops! There was an error.');
        }
      }
    )
    .catch(err => err);
  console.log(response);
  return true;
}

function makeEventList(eventArray) {
  let counter = 1;
  let message;
  eventArray.forEach(event => {
    message += `${counter}) ${event.event} on ${event.on} `;
    counter++;
  });
  return message;
}

async function reminderMessage({ sender, reminder, full_message }) {
  try {
    return await client.messages.create(
      {
        to: sender.mobile,
        from: TWILIO_PHONE,
        body: `Hey, ${
          sender.name
        }! You asked that I remind you to '${reminder || full_message}'!`
      },
      function(error, message) {
        if (!error) {
          console.log('Message sent on:');
          console.log(message.dateCreated);
        } else {
          console.error(error);
          console.log('Oops! There was an error.');
        }
      }
    );
  } catch (e) {
    console.error(e);
  }
}

async function sendConfirmation({
  sender,
  original_time,
  reminder,
  full_message
}) {
  try {
    return await client.messages.create({
      to: sender.mobile,
      from: TWILIO_PHONE,
      body: `Hey, ${sender.name}! I'll remind you to '${reminder ||
        full_message}' in ${original_time}!`
    });
  } catch (e) {
    console.error(e);
  }
}

async function genericMessage({ sender, message }) {
  const response = await client.messages.create(
    {
      to: sender.mobile,
      from: TWILIO_PHONE,
      body: message
    },
    function(error, message) {
      if (!error) {
        console.log('Message sent on:');
        console.log(message.dateCreated);
      } else {
        console.error(error);
        console.log('Oops! There was an error.');
      }
    }
  );
  return true;
}

module.exports = {
  client,
  sendWeeklyEvents,
  reminderMessage,
  sendConfirmation,
  genericMessage
};
