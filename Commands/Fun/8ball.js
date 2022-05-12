const { Client, CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: "8ball",
    description: "Ask your question and I will answer it",
    Perms: "",
    usage: "/8ball <question>",
    options: [
        {
            name: "question",
            description: "REQUIRED | Provide your question (in yes/no)",
            type: "STRING",
            required: true
        }
    ],
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
	execute(interaction) {
        const { channel, options } = interaction
        const Question = options.getString("question")
        const replies = ['Yes', 'No', 'Never', 'Forever', "I'm not sure, please ask again."];
        const result = Math.floor(Math.random() * replies.length);
        const Response = new MessageEmbed()
            .setAuthor('The 8th ball 🎱 indicates')
            .setColor('ORANGE')
            .addField('Question:', `${Question}`)
            .addField('Answer:', `${replies[result]}`)
        return interaction.reply({embeds:[Response]})  
    }
}