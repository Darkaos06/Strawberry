const { MessageEmbed, Message, CommandInteraction, Client} = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndent } = require("common-tags");
let color = "#ff0000";

const create_mh = require(`../../Structures/Functions/menu`);
module.exports = {
  name: "help",
  usage: "/help", // This is how you set the usage for the command.
  description: "Shows all available bot commands",
  options: [
    {
      name: "command",
      description: "Enter the command or category that you want to get help with.",
      required: false,
      type: "STRING",
    },
  ],

  async execute(interaction, client) {
    const helpcmd = interaction.options.getString("command");
    const mbr = interaction.user.tag;

    let categories = [];
    let cots = [];

    if (!helpcmd) {
      let ignored = ["the ingored commands"];
      const emo = {
        Developer: "🗒️",
        Administration: "🔧",
        Moderation: "🔧",
        Utilities: "⚙️",
        Fun: "🎊",
        Music: "🎵"

        // Add any category
      };

      let ccate = [];
      readdirSync("./Commands/").forEach((dir) => {
        if (ignored.includes(dir.toLowerCase())) return;
        const commands = readdirSync(`./Commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        if (ignored.includes(dir.toLowerCase())) return;

        const name = `${emo[dir]} - ${dir}`;
        let nome = dir.toUpperCase();

        let cats = new Object();
        cats = {
          name: name,
          value: `\`/help ${dir.toLowerCase()}\``,
          inline: true,
        };

        categories.push(cats);
        ccate.push(nome);
      });

      const description = stripIndent`
      Use the drop-down menu or follow the commands given below.
      You can also type /help [command].
            `;
      const embed = new MessageEmbed()
        .setTitle(`Strawberry Commands`)
        .setDescription(`\`\`\`asciidoc\n${description}\`\`\``)
        .addFields(categories)
        .setFooter(
          `Asked by ${mbr}`,
          interaction.user.displayAvatarURL({
            dynamic: true,
          })
        )
        .setTimestamp()
        .setColor(color);

      let menus = create_mh(ccate);
    
      return await interaction.reply({embeds: [embed], components: menus.smenu, fetchReply: true, }).then( async (interactionn) => {
          const menuID = menus.sid;

          const select = async (interaction) => {
            if (interaction.customId != menuID) return;

            let { values } = interaction;

            let value = values[0];

            let catts = [];

            readdirSync("./Commands/").forEach((dir) => {
              if (dir.toLowerCase() !== value.toLowerCase()) return;
              const commands = readdirSync(`./Commands/${dir}/`).filter(
                (file) => file.endsWith(".js")
              );
              const cmds = commands.map((command) => {
                let file = require(`../../Commands/${dir}/${command}`);

                if (!file.name) return "No command name";

                let name = file.name.replace(".js", "");

                if (client.commands.get(name).hidden) return;

                let des = client.commands.get(name).description;
                let usg = client.commands.get(name).usage;
                if (!usg) {
          usg = "No usage indicated.";
              }
                let emo = client.commands.get(name).emoji;
                let emoe = emo ? `${emo} - ` : ``;

                let obj = {
                  cname: `${emoe}\`${name}\` |  **${usg}**`,
                  des,
                };

                return obj;
              });

              let dota = new Object();

              cmds.map((co) => {
                if (co == undefined) return;

                dota = {
                  name: `${cmds.length === 0 ? "In progress." : co.cname}`,
                  value: co.des ? co.des : `No description.`,
                  inline: true,
                };
                catts.push(dota);
              });

              cots.push(dir.toLowerCase());
            });

            if (cots.includes(value.toLowerCase())) {
              const combed = new MessageEmbed()
                .setTitle(
                  `__Commands of ${
                    value.charAt(0).toUpperCase() + value.slice(1)
                  }__`
                )
                .setDescription(
                  `Use \`/help\` followed with the name of the command to get more information: \nFor example: \`/help botinfo\`.\n\n`
                )
                .addFields(catts)
                .setColor(color);

              await interaction.deferUpdate();

              return interaction.editReply({
                embeds: [combed],
                components: menus.smenu,
              });
            }
          };
          const filter = (interaction) => {
            return (
              !interaction.user.bot &&
              interaction.user.id == interaction.member.id
            );
          };

          const collector = interactionn.createMessageComponentCollector({
            filter,
            componentType: "SELECT_MENU",
          });
          collector.on("collect", select);
          collector.on("end", () => null);
        });
    } else {
      let catts = [];

      readdirSync("./Commands/").forEach((dir) => {
        if (dir.toLowerCase() !== helpcmd.toLowerCase()) return;
        const commands = readdirSync(`./Commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../Commands/${dir}/${command}`);
          if (!file.name) return "Any command name.";
          let name = file.name.replace(".js", "");
          if (client.commands.get(name).hidden) return;
          let usg = client.commands.get(name).usage;
          if (!usg) {
          usg = "No usage provided.";
       }

          let des = client.commands.get(name).description;
          let emo = client.commands.get(name).emoji;
          let emoe = emo ? `${emo} - ` : ``;
          let obj = {
            cname: `${emoe}\`${name}\` |  **${usg}**`,
            des,
          };
          return obj;
        });
        let dota = new Object();
        cmds.map((co) => {
          if (co == undefined) return;
          dota = {
            name: `${cmds.length === 0 ? "In progress." : co.cname}`,
            value: co.des ? co.des : `Any description.`,
            inline: true,
          };
          catts.push(dota);
        });

        cots.push(dir.toLowerCase());
      });

      const command = client.commands.get(helpcmd.toLowerCase());

      if (cots.includes(helpcmd.toLowerCase())) {
        const combed = new MessageEmbed()
          .setTitle(
            `__Commands of ${
              helpcmd.charAt(0).toUpperCase() + helpcmd.slice(1)
            }__`
          )
          .setDescription(
            `Use \`/help\` followed with the name of the command to get more information: \nFor example: \`/help botinfo\`.\n\n`
          )
          .addFields(catts)
          .setColor(color);

        return interaction.reply({ embeds: [combed] });
      }

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(`> >>> ⛔ : Invalid order! Make sure you haven't used any spaces. Use \`/help\` to see all the commands.`)
          .setColor("RED");
        return await interaction.reply({
          embeds: [embed],
          allowedMentions: {
            repliedUser: false,
          },
        });
      }
      const embed = new MessageEmbed()
        .setTitle("Command Details:")
        .addField(
          "Command:",
          command.name ? `\`${command.name}\`` : "No name."
        )
        .addField(
          "Usage:",
          command.usage
            ? `\`${command.usage}\``
            : `\`/${command.name}\``
        )
        .addField(
          "Description:",
          command.description
            ? command.description
            : "No description."
        )
        .setFooter(
          `Asked by ${mbr}`,
          interaction.user.displayAvatarURL({
            dynamic: true,
          })
        )
        .setTimestamp()
        .setColor(color);
      return await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
