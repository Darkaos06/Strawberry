const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "play",
    description: "Plays a piece of music or adds one to the queue.",
    options: [
        {
            name: "song",
            description: "REQUIRED | Specify a song name or a link.",
            type: "STRING",
            required: true
        }
    ],
    usage: "/play <song>",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(">>> ⛔ : You must be in a voice channel to use this command.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(`>>> ⛔ : I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{
            client.distube.play( VoiceChannel, options.getString("song"), { textChannel: channel, member: member});
            return interaction.reply({embeds: [new MessageEmbed()
            .setColor('#00ffe4')
            .setDescription("✅ **Your request has been registered.**")]})

        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("#f4424b")
            .setDescription(`>>> ⛔ : ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}