const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = 'RANDOM'
const paginationEmbed = require('discordjs-button-pagination');

module.exports = {
    name: 'userinfo',
    description: "View a member's information",
    options: [
        {
            name: 'member',
            description: 'REQUIRED | Select a member.',
            type: 'USER',
            required: false
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options } = interaction
        const target = options.getUser('member') || interaction.user;
        const u = interaction.guild.members.cache.get(target.id)
        const e = new MessageEmbed()
        .setTitle('âšī¸ | General Informations')
            .setAuthor({
                name: u.user.tag,
                iconURL: u.displayAvatarURL({ dynamic: true })
            })
            .setColor(config)
            .setThumbnail(u.displayAvatarURL({
                size: 1024,
                dynamic: true
            }))
            .setFields(
                {
                    name: 'đ | Name',
                    value: `\`${u.user.username}\``,
                    inline: false
                }, {
                name: `đ | ID`,
                value: `\`${u.user.id}\``,
                inline: false
            }, {
                name: 'đī¸ | Created on',
                value: `<t:${parseInt(u.user.createdTimestamp / 1000)}:R>`,
                inline: false
            }, {
                name: 'â° | Joined the',
                value: `<t:${parseInt(u.joinedTimestamp / 1000)}:R>`,
                inline: false
            }, {
                name: 'đ­ | Nickname',
                value: `\`${u.nickname ? u.nickname : `\`None\``}\``,
                inline: false
            }, {
                name: 'đ | Status',
                value: `\`${u.presence?.status || `offline`}\``,
                inline: false
            }
            )


        const ee = new MessageEmbed()
            .setAuthor({
                name: u.user.tag,
                iconURL: target.displayAvatarURL({ dynamic: true })
            })
            .setColor(config)
            .setThumbnail(u.displayAvatarURL({
                size: 1024,
                dynamic: true
            }))
            .addFields(
                {
                    name: 'đ§âđŧ | Roles',
                    value: `${u.roles.cache.map(r => r).sort((first, second) => second.position - first.position).join(`, `)}`,
                    inline: false
                }, {
                name: 'đ§ââī¸ | Highest role',
                value: `${u.roles.highest}`,
                inline: false
            }
            )

            const eee = new MessageEmbed()
            .setAuthor({
                name: u.user.tag,
                iconURL: target.displayAvatarURL({ dynamic: true })
            })
            .setColor(config)
            .setThumbnail(u.displayAvatarURL({
                size: 1024,
                dynamic: true
            }))
            .setFields({
                name: 'đ¨ââī¸ | Permissions',
                value: `\`\`\`${u.permissions.toArray().join(` | `)}\`\`\``,
                inline: false
            })
            const btn1 = new MessageButton()
            .setStyle('SECONDARY')
            .setCustomId('previousbtn')
            .setEmoji('â')

            const btn2 = new MessageButton()
            .setStyle('SECONDARY')
            .setCustomId('nextbtn')
            .setEmoji('âļ')

            const embedlist = [
                e,
                ee,
                eee
            ]

            const buttonList = [
                btn1,
                btn2
            ]
            const timeout = 30000;

            paginationEmbed(interaction, embedlist, buttonList, timeout);
    }

}
