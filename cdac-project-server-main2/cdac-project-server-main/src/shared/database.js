const mongoose = require('mongoose');
const config = require("./config/config");

mongoose.connect(config.mongodb.host, (err) => {
  if (err) console.log("Mongodb is not connected");
  else console.log("Mongodb is connected");
});

module.exports = mongoose;