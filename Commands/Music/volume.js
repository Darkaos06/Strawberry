const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "volume",
    description: "Changes the volume of the music.",
    usage: "/volume <percent>",
    options: [
        {
            name: "percent",
            description: "REQUIRED | Indicate the percentage of the volume of the bot (1-200) (do not type the %).",
            type: "NUMBER",
            required: true
        }
    ],

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
            const Volume = options.getNumber("percent");
            if(Volume > 200 || Volume < 1)
            return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(":x: **Vous devez indiquer un nombre entre 1 et 200.**")]});

            client.distube.setVolume(VoiceChannel, Volume);
            return interaction.reply({ embeds: [new MessageEmbed().setColor('#00ffe4').setDescription(`✅ **Volume ajusté à ** \`${Volume}%\``)]});

        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("#f4424b")
            .setDescription(`>>> ⛔ : ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}