const { Message } = require('discord.js');
const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    id: "skipSong",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        try{
            const { options, member, guild, channel } = interaction;
            const VoiceChannel = member.voice.channel;
            const queue = await client.distube.getQueue(VoiceChannel);

            if(!VoiceChannel)
            return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(">>> ⛔ : You must be in a voice channel to use this command.")]})

            if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(`>>> ⛔ : I am already playing music in <#${guild.me.voice.channelId}>.`)]})

            try{

                await queue.skip(VoiceChannel);
                interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription("✅ **Skipped.**")]});
                setTimeout(function(){ 
                    return channel.bulkDelete(1, true)
                }, 1500);  

            } catch (e) {
                await queue.stop(VoiceChannel);
                interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription("✅ **Skipped and disconnected.**")]});
                setTimeout(function(){ 
                    return channel.bulkDelete(2, true)
                }, 1500);  
            
            }
        } catch (e) {
            return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(`>>> ⛔ : ${e}`)], ephemeral: true})
        }
    }
}