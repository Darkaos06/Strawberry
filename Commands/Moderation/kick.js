const { CommandInteraction, MessageEmbed } = require("discord.js");
require('dotenv').config()
const LyxPurp = process.env.LYXPURP
const db = require('../../Structures/Models/infractionsData');

module.exports = {
    name: "kick",
    description: "Kick a member.",
    permission: "KICK_MEMBERS",
    usage: "/kick <member> <reason>",
    options: [
        {
            name: "member",
            description: "REQUIRED | Select a member.",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "REQUIRED | Specify a reason.",
            type: "STRING",
            required: true
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

        // Creates the mutli-use embed.
        const Response = new MessageEmbed()
        .setColor(LyxPurp)
        .setAuthor("KICK SYSTEM", guild.iconURL())
        
        // Checks if the target member is the same as the command executer.
        if(Target.id === member.id) {
            Response.setDescription(">>> ⛔ : You can't ban yourself.")
            return interaction.reply({embeds: [Response]});
        }
        
        // Checks if one of the target roles are higher than the command executer's.
        if(Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription(">>> ⛔ : You can't kick a member with a role superior to yours.")
            return interaction.reply({embeds: [Response]});
        }

        // Checks if the target member has the KICK_MEMBERS permission and declare them as a staff member.
        if(Target.permissions.has("KICK_MEMBERS")) {
            Response.setDescription(`>>> ⛔ : You cannot kick a member with permission \`KICK_MEMBERS\`.`)
            return interaction.reply({embeds: [Response]});
        }

        // Stores the kick data in the data base.
        db.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    GuildID: guild.id,
                    UserID: Target.id,
                    KickData: [
                        {
                            ExecuterID: member.id,
                            ExcuterTag: member.user.tag,
                            TargetID: Target.id,
                            TargetTag: Target.user.tag,
                            Reason: Reason,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const KickDataObject = 
                {
                    ExecuterID: member.id,
                    ExcuterTag: member.user.tag,
                    TargetID: Target.id,
                    TargetTag: Target.user.tag,
                    Reason: Reason,
                    Date: parseInt(interaction.createdTimestamp / 1000)  
                }
                data.KickData.push(KickDataObject)
            }
            data.save()
        });

        // Sends the kick notice to the target member.
        Target.send({embeds: [new MessageEmbed().setColor(LyxPurp).setAuthor("KICK MASTER", guild.iconURL()).setDescription(`You have been kicked from **${guild.nane}** for the following reason: \`${Reason}\``)]})
        .catch(( ) => { console.log(`>>> ⛔ : Strawberry could not send a message to ${Target.user.tag}.`)});

        // kick the target member, with the reason and the message days.
        Target.kick({reason: Reason})
        .catch((err) => { console.log(err) });

        // Replies to the interaction with the kick notice.
        Response.setDescription(`Member: ${Target} **|** \`${Target.id}\` has been **kicked**\nBy: ${member} **|** \`${member.id}\`\nReason: \`${Reason}\``)
        interaction.reply({embeds: [Response]});
    }
}