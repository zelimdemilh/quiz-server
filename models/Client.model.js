const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: String,
  password: String,
  role: {
    type: String,
    default: "user"
  }
});

const Client = mongoose.model("client", clientSchema);

module.exports = Client;
