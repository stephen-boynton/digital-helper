const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
module.exports = mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });
