module.exports = function budgetItemConversion(item) {
  if (item === 'grocery') {
    return 'groceries';
  }

  if (item === 'electricity') {
    return 'electric';
  }

  if (item === 'savings') {
    return 'total savings';
  }

  return item;
};
