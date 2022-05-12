const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

module.exports = model("LevellingDB", new Schema({
    guildId: reqString,
    rankCard: Boolean,
}))