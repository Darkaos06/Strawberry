const { MessageEmbed, GuildMember, WebhookClient } = require("discord.js");
const weSetupData = require("../../Structures/Models/WelcomeSetupDB");
module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member 
   */
  async execute(member) {

    const { user, guild } = member;

    const Data = await weSetupData.findOne({
      GuildID: member.guild.id,
    });
    if (!Data) return;
    
    const logChannel = member.guild.channels.cache.get(Data.weChannel); 
    const logs = await member.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if (log.action == "BOT_ADD") {
      const botJoinedEmbed = new MessageEmbed()
        .setColor('AQUA')
        .setAuthor({
          name: user.tag, 
          iconURL: user.avatarURL({dynamic: true, size: 512})
        })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`Welcome ${member} on the server **${guild.name}** !\nAccount created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nNumber of members now: **${guild.memberCount}**`)
        .setFooter({
          text: `ID: ${user.id}`
        })

      await createAndDeleteWebhook(botJoinedEmbed)
    } else { 
      const userJoinedEmbed = new MessageEmbed()
        .setColor('AQUA')
        .setAuthor({
          name: user.tag, 
          iconURL: user.avatarURL({dynamic: true, size: 512})
        })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`Welcome ${member} on the server **${guild.name}** !\nAccount created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nNumber of members now: **${guild.memberCount}**`)
        .setFooter({
          text: `ID: ${user.id}`
        })

      await createAndDeleteWebhook(userJoinedEmbed)
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook('Strawberry Welcomer', {
        avatar: 'https://cdn-icons-png.flaticon.com/512/3075/3075891.png'
      }).then(webhook => {
        webhook.send({
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { }))
      });
    }
  }
}