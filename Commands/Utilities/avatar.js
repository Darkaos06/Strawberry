const { CommandInteraction, MessageEmbed } = require('discord.js')
require('../../Events/Client/ready'); // which executes 'mongoose.connect()'


module.exports = {
    name: "avatar",
    description: "Shows a member's profile picture.",
    usage: "/avatar <member>",
    options:[
        {
            name: "member",
            description: "REQUIRED | Select a member.",
            type: "USER",
            required: true,
        },
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { guild, member, options } = interaction
        const Target = options.getMember('member');
        var mongoose = require('mongoose');
        console.log(mongoose.connection.readyState);
        interaction.reply({embeds: 
            [new MessageEmbed()
            .setAuthor(`Avatar of ${Target.user.tag}`, `${Target.displayAvatarURL({dynamic: true, size: 512})}`)
            .setImage(`${Target.displayAvatarURL({dynamic: true, size: 512})}`)
            .setColor("#2f3136")
            ]
        , ephemeral: true});
    }
}
