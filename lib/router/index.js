const createNewMessage = require('../Message');

module.exports = async function routeIncoming(textObj) {
  const message = createNewMessage(textObj);
  message.remindMe();
  return {
    message_processed: true,
    type: 'remind_me'
  };
};
