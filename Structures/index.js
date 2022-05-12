const { Client, Collection } = require('discord.js');
const client = new Client({intents: 32767});
require('dotenv').config()

const {promisify} = require("util");
const {glob} = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();
client.buttons = new Collection();

const { DisTube } = require('distube');
const youtubedl = require('@distube/youtube-dl')
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin(), 
        new SoundCloudPlugin()
    ],
    youtubeDL: false,
});
module.exports= client;

["Events", "Commands", "Buttons"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii);
    require(`./Handlers/AntiCrash`)(client)
});


client.login(process.env.TOKEN)