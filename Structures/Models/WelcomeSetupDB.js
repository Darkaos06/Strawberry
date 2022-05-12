const { model, Schema } = require("mongoose");

module.exports = model(
  "WelcomeSetup",
  new Schema({
    GuildID: String,
    weChannel: String,
  })
);