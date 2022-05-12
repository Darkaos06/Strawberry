const { MessageEmbed, CommandInteraction, Client, version } = require("discord.js");
const { connection }                                        = require("mongoose");
const os                                                    = require("os");

module.exports = {
    name: "botinfo",
    description: "Shows the status of the bot and the database.",
    usage: "/botinfo",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        await client.user.fetch();
        await client.application.fetch();

        const status = [
            "Disconnected",
            "Connected",
            "Connecting",
            "Disconnecting"
        ];
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`🧙🏻‍♂️ ${client.user.username} Status`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(interaction.client.application.description || "")
            .addFields(
                { name: "🧠 Client", value: client.user.tag, inline: true },
                { name: "📆 Created on", value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "☑ Verified?", value: client.user.flags.has("VERIFIED_BOT") ? "Yes" : "No", inline: true },
                { name: "👩🏻‍💻 Owner", value: `${interaction.client.application.owner.tag || "None"}`, inline: true },
                { name: "📚 Database", value: status[connection.readyState], inline: true },
                { name: "💾 Memory Usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`, inline: true },
                { name: "🖥 OS", value: os.type().includes("Windows") ? "Windows" : os.type(), inline: true },
                { name: "👩🏻‍🔧 Node.js", value: process.version, inline: true },
                { name: "🛠 Discord.js", value: version, inline: true },
                { name: "⏰ Up Since", value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true },
                { name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true },
                { name: "🤹🏻‍♀️ Commands", value: `${client.commands.size}`, inline: true },
                { name: "👨‍👩‍👧‍👦 Servers", value: `${client.guilds.cache.size}`, inline: true },
                { name: "👧🏻 Users", value: `${client.users.cache.size}`, inline: true },
                { name: "📺 Channels", value: `${client.channels.cache.filter((channel) => channel.type !== "GUILD_CATEGORY").size}`, inline: true }
            );
        interaction.reply({ embeds: [embed]});
    }
}