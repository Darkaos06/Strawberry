const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const db = require("../../Structures/Models/WarningDB");

module.exports = {
    name: "warning",
    description: "Infractions system",
    permission: "KICK_MEMBERS",
    usage: "/warning <subcommand> <member>...",
    options: [
        {
            name: "add",
            description: "Adds a warning to a member.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "REQUIRED | Select the member.",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "REQUIRED | Specify the reason for this warning.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "evidence",
                    description: "OPTIONAL | Indicate an evidence, the link of a message for example.",
                    type: "STRING",
                    required: false
                },
            ]
        },
        {
            name: "check",
            description: "Checks a member's infractions",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "REQUIRED | Select the member.",
                    type: "USER",
                    required: true
                },
            ]
        },
        {
            name: "remove",
            description: "Remove a warning from a member.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "REQUIRED | Select the member.",
                    type: "USER",
                    required: true
                },
                {
                    name: "warnid",
                    description: "REQUIRED | Specify the ID of the warning to be removed.",
                    type: "NUMBER",
                    required: true
                },
            ]
        },
        {
            name: "clear",
            description: "Clears all warnings from a member.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "REQUIRED | Select the member.",
                    type: "USER",
                    required: true
                },
            ]
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const { options, guildId, user, guild } = interaction;
        const Sub = options.getSubcommand(["add", "check", "remove", "clear"]);
        const Target = options.getMember("member");
        const Reason = options.getString("reason");
        const Evidence = options.getString("evidence") || "No evidence provided.";
        const WarnID = options.getNumber("warnid") - 1;
        const WarnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        if(Sub === "add"){
            db.findOne({ GuildID: guildId, UserID: Target.id, UserTag: Target.user.tag}, async (err, data) => {
                if(err) throw err;
                if(!data){
                    data = new db({
                        GuildID: guildId, 
                        UserID: Target.id, 
                        UserTag: Target.user.tag,
                        Content: [
                            {
                                ExecuterID: user.id,
                                ExecuterTag: user.tag,
                                Reason: Reason,
                                Evidence: Evidence,
                                Date: WarnDate
                            }
                        ],
                    })
                } else {
                    const obj = {
                        ExecuterID: user.id,
                        ExecuterTag: user.tag,
                        Reason: Reason,
                        Evidence: Evidence,
                        Date: WarnDate
                    }
                    data.Content.push(obj)
                }
                data.save()
            });

            interaction.reply({embeds: [new MessageEmbed()
            .setTitle(">>> ✅ : Avertissement ajouté")
            .setColor("BLURPLE")
            .setDescription(`**Member**: ${Target.user.tag} \n**Reason**: ${Reason}\n**Evidence**: ${Evidence}\n**ID**  ${Target.id}\nThe warning ID can be obtained by doing: \`\`\`/warning check\`\`\``)
            
        ]});

        } else if(Sub === "check"){
        db.findOne({GuildID: guildId, UserID: Target.id, UserTag: Target.user.tag}, async (err, data) => {
            if(err) throw err;
            if(data) {
                interaction.reply({embeds: [new MessageEmbed()
                .setTitle(">>> ℹ️ : List of Warnings")
                .setColor("BLURPLE")
                .setDescription(`${data.Content.map(
                    (w, i) => `**ID**: ${i + 1}\n**By**: ${w.ExecuterTag}\n**Date**: ${w.Date}\n**Reason**: ${w.Reason}\n**Evidence**: ${w.Evidence}\n\n`
                ).join(" ")}`)]});
            } else {
                interaction.reply({embeds: [new MessageEmbed()
                    .setTitle(">>> ❌ : Error")
                    .setColor("BLURPLE")
                    .setDescription(`${Target.user.tag} has any warning.`)
                    .setFooter(`ID : ${Target.id}`)
            ]});
                
            }
        });

        } else if (Sub === "remove"){

        db.findOne({GuildID: guildId, UserID: Target.id, UserTag: Target.user.tag}, async (err, data) => {
            if(err) throw err;
            if(data) {
                data.Content.splice(WarnID, 1)
                interaction.reply({embeds: [new MessageEmbed()
                    .setTitle(">>> ✅ : Warning deleted")
                    .setColor("BLURPLE")
                    .setDescription(`The ID warning ${WarnID + 1} of ${Target.user.tag} has been removed.`)]});
                    data.save()
            } else {
                interaction.reply({embeds: [new MessageEmbed()
                    .setTitle(">>> ❌ : Error")
                    .setColor("BLURPLE")
                    .setDescription(`${Target.user.tag} has any warning.`)
                    .setFooter(`ID : ${Target.id}`)
                ]});
            }
        });

        } else if (Sub === "clear"){

        db.findOne({GuildID: guildId, UserID: Target.id, UserTag: Target.user.tag}, async (err, data) => {
            if(err) throw err;
            if(data) {
                await db.findOneAndDelete({ GuildID: guildId, UserID: Target.id, UserTag: Target.user.tag })
                interaction.reply({embeds: [new MessageEmbed()
                    .setTitle("🚮 : Warnings cleared")
                    .setColor("BLURPLE")
                    .setDescription(`All warnings for ${Target.user.tag} have been removed.`)
                    .setFooter(`ID : ${Target.id}`)
                ]});
            } else {
                interaction.reply({embeds: [new MessageEmbed()
                    .setTitle(">>> ❌ : Error")
                    .setColor("BLURPLE")
                    .setDescription(`${Target.user.tag} has any warning.`)
                    .setFooter(`ID : ${Target.id}`)
                ]});
            }
        })
        }
    }
}