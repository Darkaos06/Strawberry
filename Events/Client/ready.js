const { Client } = require("discord.js")
const mongoose = require('mongoose')
require('dotenv').config()
const Database = process.env.DATABASE
const ms = require('ms')
const osUtils = require('os-utils')
const DB = require('../../Structures/Models/ClientDB');

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(interaction, client) {
        console.log("Connected")
        client.user.setActivity(`a super /help !`, {type: `WATCHING`, url: "https://twitch.tv/username"})
        client.user.setStatus(`dnd`)
        if(!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Connected to the Database")
        }).catch((err) => {
            console.log(err)
        })
        // -------------- Events --------------//

// Memory Data Update
let memArray = [];

setInterval(async () => {
  //Used Memory in GB
  memArray.push((osUtils.totalmem() - osUtils.freemem()) / 1024);

  if (memArray.length >= 14) {
    memArray.shift();
  }

  // Store in Database
  await DB.findOneAndUpdate({
      Client: true,
    }, {
      Memory: memArray,
    }, {
      upsert: true,
    });
}, ms("5s")); //= 5000 (ms)

    }
}