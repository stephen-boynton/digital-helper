require('now-env');
const { boomify } = require('boom');
const routeIncoming = require('./router');
const { scheduleChecker } = require('./childProcesses');

const Hapi = require('hapi');

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost'
});

const init = async () => {
  try {
    await server.start();
    console.log(`Server running...`);
    scheduleChecker();
  } catch (e) {
    console.error(e);
  }
};

server.route({
  method: 'POST',
  path: '/incoming',
  handler: async (request, h) => {
    try {
      console.log('Message received');
      return await h.response(await routeIncoming(request.payload));
    } catch (e) {
      console.error(e);
    }
  }
});

process.on('unhandledRejection', err => {
  console.error(err);
});

init();
