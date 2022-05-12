const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Models/WelcomeSetupDB");

module.exports = {
  name: "welcome-setup",
  description: "Setup or reset the logs channel",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "setup",
      description: "REQUIRED | Setup the server logs channel",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "REQUIRED | Select the channel to send the server logs to",
          required: true,
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
        },
      ],
    },
    {
      name: "reset",
      description: "Reset the logs channel",
      type: "SUB_COMMAND",
    },
  ],
  /**
   *
   * @param {GuildMember} member
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      const options = interaction.options;
      const { guild } = interaction;

      switch (options.getSubcommand()) {
        case "setup":
          {
            const LogsChannel = options.getChannel("channel");

            await DB.findOneAndUpdate(
              { GuildID: guild.id },
              {
                weChannel: LogsChannel.id,
              },
              {
                new: true,
                upsert: true,
              }
            ).catch((err) => console.log(err));

            const LogsSetup = new MessageEmbed()
              .setDescription(
                "<a:Success:934736751468113930> | Successfully setup the server logs"
              )
              .setColor("#43b581");

            await guild.channels.cache
              .get(LogsChannel.id)
              .send({ embeds: [LogsSetup] })
              .then((m) => {
                setTimeout(() => {
                  m.delete().catch(() => {});
                }, 1 * 7500);
              });

            await interaction.reply({
              content: "Done",
              ephemeral: true,
            });
          }
          break;
        case "reset":
          {
            const LogsReset = new MessageEmbed()
              .setDescription(
                "<a:Success:934736751468113930> | Successfully reset the logging channel"
              )
              .setColor("#43b581");
            DB.deleteMany({ GuildID: guild.id }, async (err, data) => {
              if (err) throw err;
              if (!data)
                return interaction.reply({
                  content: "There is no data to delete",
                });
              interaction.reply({ embeds: [LogsReset] });
            });
          }
          return;
      }
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setColor("#f04947")
        .setDescription(`<a:Error:934736751740715009> Error: ${e}`);
      return interaction.reply({
        embeds: [errorEmbed],
        ephemeral: false,
      });
    }
  },
};
