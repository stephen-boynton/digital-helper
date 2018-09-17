const { reduce } = require('lodash/fp');

module.exports = function pipeP(...fxs) {
  return async args => reduce(async (input, fx) => fx(await input), args, fxs);
};
