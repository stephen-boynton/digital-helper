const {
  PRIVATE_KEY_ID: key,
  CLIENT_ID: serviceAccountId,
  BOYNBLAT: calendarId,
  SERVICE_EMAIL: email
} = process.env;
const { google } = require('googleapis');
const moment = require('moment');
const timezone = 'UTC-05:00';

exports.getWeekEvents = async function getWeekEvents() {
  const calendar = calendarId;
  const params = {
    emails: 'a',
    timeMin: moment().toISOString(),
    timeMax: moment()
      .add(7, 'd')
      .toISOString()
  };
  const events = await cal.Events.list(calendar, params).catch(error => {
    return { error };
  });

  console.log(events);
  // if (events.error) {
  //   console.error(events.error);
  // }
  // const mappedEvents = {
  //   total_items: events.length,
  //   events: events.map(event => {
  //     return {
  //       event: event.summary,
  //       on: moment(event.start.date).format('dddd, MMMM Do YYYY')
  //     };
  //   })
  // };
  // await sendEvents(mappedEvents);
  // return true;
};

exports.cal = async () => {
  await cal;
};
