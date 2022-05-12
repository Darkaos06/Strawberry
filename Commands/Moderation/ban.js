const { CommandInteraction, MessageEmbed } = require("discord.js");
require('dotenv').config()
const LyxPurp = process.env.LYXPURP
const db = require('../../Structures/Models/infractionsData');

module.exports = {
    name: "ban",
    description: "Permanently ban a member from the server",
    permission: "BAN_MEMBERS",
    usage: "/ban <member> <reason> <messages>",
    options: [
        {
            name: "member",
            description: "REQUIRED | Select a member.",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "REQUIRD | Specify a reason.",
            type: "STRING",
            required: true
        },
        {
            name: "messages",
            description: "Number of days of messages you want to delete (24h / 1-7d).",
            type: "STRING",
            required: false,
            choices: [
                {
                    name: "24 hours",
                    value: "24"
                },
                {
                    name: "1 day",
                    value: "1"
                },
                {
                    name: "2 days",
                    value: "2"
                },
                {
                    name: "3 days",
                    value: "3"
                },
                {
                    name: "4 days",
                    value: "4"
                },
                {
                    name: "5 days",
                    value: "5"
                },
                {
                    name: "6 days",
                    value: "6"
                },
                {
                    name: "7 days",
                    value: "7"
                },
            ]
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { guild, member, options, reply } = interaction; // Grabs the specified objects from the interaction object.

        const Target = options.getMember("member"); // Gets the target member object.
        const Reason = options.getString("reason"); // Gets the reason string.
        const Amount = options.getString("messages"); // Gets the amount of days or hours to delete the message history.

        // Creates the mutli-use embed.
        const Response = new MessageEmbed()
        .setColor(LyxPurp)
        .setAuthor("BAN SYSTEM", guild.iconURL())
        
        // Checks if the target member is the same as the command executer.
        if(Target.id === member.id) {
            Response.setDescription(">>> ⛔ : You can't ban yourself.")
            return interaction.reply({embeds: [Response]});
        }
        
        // Checks if one of the target roles are higher than the command executer's.
        if(Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription(">>> ⛔ : You can't ban a member with a higher role than yours.")
            return interaction.reply({embeds: [Response]});
        }

        // Checks if the target member has the BAN_MEMBERS permission and declare them as a staff member.
        if(Target.permissions.has("BAN_MEMBERS")) {
            Response.setDescription(`>>> ⛔ : You cannot ban a member with the permission \`BAN_MEMBERS\`.`)
            return interaction.reply({embeds: [Response]});
        }

        // Stores the ban data in the data base.
        db.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    GuildID: guild.id,
                    UserID: Target.id,
                    BanData: [
                        {
                            ExecuterID: member.id,
                            ExcuterTag: member.user.tag,
                            TargetID: Target.id,
                            TargetTag: Target.user.tag,
                            Messages: Amount,
                            Reason: Reason,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const BanDataObject = 
                {
                    ExecuterID: member.id,
                    ExcuterTag: member.user.tag,
                    TargetID: Target.id,
                    TargetTag: Target.user.tag,
                    Messages: Amount,
                    Reason: Reason,
                    Date: parseInt(interaction.createdTimestamp / 1000)  
                }
                data.BanData.push(BanDataObject)
            }
            data.save()
        });

        // Sends the ban notice to the member
        Target.send({embeds: [new MessageEmbed().setColor(LyxPurp).setAuthor("BAN MASTER", guild.iconURL()).setDescription(`You have been banned from **${guild.name}**  for the following reason: \`${Reason}\``)]})
        .catch(( ) => { console.log(`>>> ⛔ : Strawberry could not send a message to ${Target.user.tag}.`)});

        // Bans the target member, with the reason and the message days.
        Target.ban({days: Amount, reason: Reason})
        .catch((err) => { console.log(err) });

        // Replies to the interaction with the ban notice.
        Response.setDescription(`Member: ${Target} **|** \`${Target.id}\` has been **banned**\nBy: ${member} **|** \`${member.id}\`\nReason: \`${Reason}\`\nDeleted messages: \`${Amount}\``)
        interaction.reply({embeds: [Response]});
    }
}