const { CommandInteraction, Client, GuildMember} = require("discord.js");

module.exports = {
    name: "activity",
    description: "Change the activity of the bot.",
    permission: "ADMINISTRATOR",
    usage: "/activity <type> <name> <status>",
    options: [
        {
            name: "type",
            description: "REQUIRED | Select the type of bot activity.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Playing",
                    value: "PLAYING"
                }, 
                {
                    name: "Listening",
                    value: "LISTENING"
                }, 
                {
                    name: "Watching",
                    value: "WATCHING"
                }, 
                {
                    name: "Streaming",
                    value: "STREAMING"
                }
            ]
        }, 
        {
            name: "name",
            description: "REQUIRED | Specify the name of the activity.",
            type: "STRING",
            required: true
        }, 
        {
            name: "status",
            description: "REQUIRED | Select the status of the bot.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Online",
                    value: "online"
                }, 
                {
                    name: "Idle",
                    value: "idle"
                }, 
                {
                    name: "Do Not Disturb",
                    value: "dnd"
                }
            ]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {GuildMember} member
     */
    execute(interaction, client, member) {
        const activityType = interaction.options.getString("type")
        const activityName = interaction.options.getString("name")
        const statusType = interaction.options.getString("status")
        client.user.setActivity(`${activityName}`, {type: `${activityType}`, url: "https://twitch.tv/username"})
        client.user.setStatus(`${statusType}`)
        interaction.reply({content: `>>> ✅ : Activity changed to ${activityType} ${activityName} with the status ${statusType}.`})
    }
}