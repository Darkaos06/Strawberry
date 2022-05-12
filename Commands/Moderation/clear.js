const { CommandInteraction, MessageEmbed } = require("discord.js")

module.exports = {
    name: "clear",
    description: "Deletes a specific number of messages in a room or from a person.",
    permission: "MANAGE_MESSAGES",
    usage: "/clear <number> <target>",
    options: [
        {
            name: "number",
            description: "REQUIRED | Specify the number of messages to delete for a show or for a person",
            type: "NUMBER",
            required: true
        },
        {
            name: "target",
            description: "OPTIONAL | Specify the person to whom you want to delete messages.",
            type: "USER",
            required: false
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { channel, options } = interaction

        const Amount = options.getNumber("number")
        const Target = options.getUser("target")

        const Messages = await channel.messages.fetch()

        const Response = new MessageEmbed()
            .setColor('LUMINOUS_VIVID_PINK')

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                } 
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`>>> 🧹 : ${messages.size} messages from ${Target} deleted.`)
                interaction.reply({embeds: [Response]})
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`>>> 🧹 : ${messages.size} deleted here.`)
                interaction.reply({embeds: [Response]})
            })
        }
    }
}