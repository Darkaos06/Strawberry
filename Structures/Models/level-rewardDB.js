const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

module.exports = model("level-rewardDB", new Schema({
    guildId: String,
    level: Number,
    role: String
}))