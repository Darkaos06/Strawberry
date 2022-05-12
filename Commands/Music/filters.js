const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "filters",
    description: "Apply filters to the music.",
    usage: "/filters <filter>",
    options: [
        {
            name: "filter",
            description: "REQUIRED | Set filters on the song.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Disable all filters",
                    value: "false"
                },
                {
                    name: "Toggle 8D audio filter",
                    value: "8d"
                },
                {
                    name: "Toggle Bassboost filter",
                    value: "bassboost"
                },
                {
                    name: "Toggle echo filter",
                    value: "echo"
                },
                {
                    name: "Toggle Nightcore filter",
                    value: "nightcore"
                },
                {
                    name: "Switching the surround filter",
                    value: "surround"
                },
            ],
        },
    ], 

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);
        const choices = interaction.options.getString("filter");
        

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(">>> ⛔ : You must be in a voice channel to use this command.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(`>>> ⛔ : I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{
            switch(choices) {
                case "false" : {
                    queue.setFilter(false);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **All filters have been deactivated.**`)]});
                }
                case "8d" : {
                    queue.setFilter(`3d`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **The filter 8D Audio has been changed.**`)]});
                }
                case "bassboost" : {
                    queue.setFilter(`bassboost`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **The filter BassBoost has been changed..**`)]});
                }
                case "echo" : {
                    queue.setFilter(`echo`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **The filter Écho has been changed.**`)]});
                }
                case "nightcore" : {
                    queue.setFilter(`nightcore`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **The filter Nightcore has been changed.**`)]});
                }
                case "surround" : {
                    queue.setFilter(`surround`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **The filter Surround has been changed.**`)]});
                }
            }
        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("#f4424b")
            .setDescription(`>>> ⛔ : ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}