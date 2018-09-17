const { curryN } = require('lodash/fp');

function demethodize(method, arity) {
  return curryN(arity, (...args) =>
    Function.prototype.call.apply(method, args)
  );
}

module.exports = demethodize;
