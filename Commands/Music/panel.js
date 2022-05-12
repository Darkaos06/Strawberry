const { Message } = require('discord.js');
const { CommandInteraction, MessageEmbed, Client, MessageActionRow, MessageButton } = require('discord.js');
const DisTube = require('distube')

module.exports = {
    name: "panel",
    description: "Shows a music panel to control the music.",
        /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        
        try {
            const { options, member, guild, channel } = interaction;
            const VoiceChannel = member.voice.channel;
            const queue = await client.distube.getQueue(VoiceChannel);
            if(!VoiceChannel)
            return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(">>> ⛔ : You must be in a voice channel to use this command.")]})
        
            if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({embeds: [new MessageEmbed().setColor('#f4424b').setDescription(`>>> ⛔ : I am already playing music in <#${guild.me.voice.channelId}>.`)]})
            
            const row1 = new MessageActionRow()
            row1.addComponents(
                new MessageButton()
                    .setCustomId('previousSong')
                    .setLabel("⏮️ | Previous")
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('skipSong')
                    .setLabel('⏭️ | Skip')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('disconnectSong')
                    .setLabel("⏹️ | Stop")
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('pauseSong')
                    .setLabel("⏸️ | Pause")
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('resumeSong')
                    .setLabel("▶️ | Resume")
                    .setStyle('SECONDARY'),
            );
            const row2 = new MessageActionRow()
            row2.addComponents(
                new MessageButton()
                    .setCustomId('shuffleSong')
                    .setLabel('🔀 | Shuffle')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('queueSong')
                    .setLabel("🔂 | Queue")
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('autoplaySong')
                    .setLabel("⏩ | Autoplay")
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('loopSong')
                    .setLabel("🔁 | Loop")
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('lyricsong')
                    .setLabel("📑 | Lyrics")
                    .setStyle('SUCCESS')
                    .setDisabled(true),
            );

                return interaction.reply(
                    {
                        embeds: [
                            new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor({name: `${queue.songs.map((song, id) => `${song.name}`).slice(0, 1)}`, iconURL: "https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif",})
                                .addField(`💡 Requested by:`, `>>> ${queue.songs[0].user}`, true)
                                .addField(`🔊 Volume:`, `>>> \`${queue.volume} %\``, true)
                                .addField(`🌀 Queue:`, `>>> \`${queue.songs.length} song(s)\`\n\`${queue.formattedDuration}\``, true)
                                // .addField(`${queue.playing ? `♾ Loop (▶️):` : `⏸️ Paused:`}`, queue.playing ? `>>> ${queue.repeatMode ? queue.repeatMode === 2 ? `${client.allEmojis.check_mark}\` Queue\`` : `${client.allEmojis.check_mark} \`Song\`` : `${client.allEmojis.x}`}` : `>>> ${client.allEmojis.check_mark}`, true)
                                // .addField(`❔ Filter${queue.filters.length > 0 ? `s`: ``}:`, `>>> ${queue.filters && queue.filters.length > 0 ? `${queue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, queue.filters.length > 4 ? false : true)
                                // .addField(`🎧 DJ-Role${client.settings.get(queue.id, `djroles`).length > 1 ? `s`: ``}:`, `>>> ${djs}`, queue.filters.length > 4 ? false : true)
                                .addField(`⏱ Duration:`, `\`${queue.formattedCurrentTime}\`/\`${queue.songs[0].formattedDuration}\``)
                                .setFooter(`💯 ${queue.songs[0].user.tag}`, `${queue.songs[0].user.displayAvatarURL({
                                    dynamic: true
                                })}`)
                        ], components: [row1, row2]
                    }
                )
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor("#f4424b")
                .setDescription(`>>> ⛔ : You need to play something.`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}