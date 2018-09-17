const { cond, T } = require('lodash/fp');

module.exports = function ifThenElse(ifFx, thenFx, elseFx) {
  return cond([[ifFx, thenFx], [T, elseFx]]);
};
