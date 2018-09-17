const { STEPHEN, ERIN } = process.env;

module.exports = function determineSender(mobile) {
  return (
    {
      [STEPHEN]: {
        name: 'Stephen',
        mobile
      },
      [ERIN]: {
        name: 'Erin',
        mobile
      }
    }[mobile] || null
  );
};
