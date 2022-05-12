const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "disconnect",
    description: "Disconnects the bot from the voice channel.",
    value: "stop",

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

            await queue.stop(VoiceChannel);
            return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription("✅ **Stopped The Music & Left The Voice Channel.**")]});

        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("#f4424b")
            .setDescription(`>>> ⛔ : ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}