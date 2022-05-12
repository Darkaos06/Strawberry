const { MessageEmbed, GuildMember } = require("discord.js");
const weSetupData = require("../../Structures/Models/WelcomeSetupDB");
module.exports = {
  name: "guildMemberRemove",
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

    const memberLeftEmbed = new MessageEmbed()
      .setColor('RED')
      .setAuthor({
        name: user.tag, 
        iconURL: user.avatarURL({dynamic: true, size: 512})
      })
      .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
      .setDescription(`${member} has left the server **${guild.name}** !\nAccount created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nNumber of members now: **${guild.memberCount}**`)
      .setFooter({
        text: `ID: ${user.id}`
      })

    if (log.action == "MEMBER_KICK") {
        const memberLeftEmbed = new MessageEmbed()
        .setColor('RED')
        .setAuthor({
          name: user.tag, 
          iconURL: user.avatarURL({dynamic: true, size: 512})
        })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`${member} has been kicked from the server **${guild.name}** !\nAccount created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nNumber of members now: **${guild.memberCount}**`)
        .setFooter({
          text: `ID: ${user.id}`
        })

      return await createAndDeleteWebhook(memberLeftEmbed);
    } else {
       const memberLeftEmbed = new MessageEmbed()
       .setColor('RED')
       .setAuthor({
         name: user.tag, 
         iconURL: user.avatarURL({dynamic: true, size: 512})
       })
       .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
       .setDescription(`${member} has left the server **${guild.name}** !\nAccount created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nNumber of members now: **${guild.memberCount}**`)
       .setFooter({
         text: `ID: ${user.id}`
       })
      return await createAndDeleteWebhook(memberLeftEmbed);
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(member.guild.name, {
        avatar: member.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { }))
      });
    }
  }
}

