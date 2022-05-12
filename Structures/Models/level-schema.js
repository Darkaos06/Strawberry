const { Schema, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

module.exports = model("level-schema", new Schema({
    guildId: String,
    userId: reqString,
    xp: Number,
    level: Number,
    role: String
}))