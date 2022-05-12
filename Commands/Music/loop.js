const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "loop",
    description: "Repeats the song/playlist.",
    value: "RepeatMode",
    usage: "/loop",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(">>> ⛔ : You must be in a voice channel to use this command.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(`>>> ⛔ : I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{

            let Mode2 = await client.distube.setRepeatMode(queue);
            return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **The repeat mode is set to: ${Mode2 = Mode2 ? Mode2 == 2 ? "Playlist" : "Track" : "Off"}**`)]});

        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("#f4424b")
            .setDescription(`>>> ⛔ : ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}