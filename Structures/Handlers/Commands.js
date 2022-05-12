const { Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const Table = new Ascii("Commands Loaded");

    CommandsArray = [];

    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name)
        return Table.addRow(file.split("/")[7], "🔶 FAILED", "Missing A Name.")

        if(!command.description)
        return Table.addRow(command.name, "🔶 FAILED", "Missing A description.")

        if(command.permission) {
            if(Perms.includes(command.permission))
            command.defaultPermission = false;
            else
            return Table.addRow(command.name, "🔶 FAILED", "Permission is invalid")
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "🔷 SUCCESFUL");

    });

    console.log(Table.toString());

    // PERMISSION CHECK
    client.on("ready", async () => {
        client.guilds.cache.forEach((g) => {
            g.commands.set(CommandsArray).then(async (command) => {
                const Roles = (commandName) => {
                    const cmdPerms = CommandsArray.find(
                        (c) => c.name === commandName
                    ).permission;
                    if (!cmdPerms) return null;

                    return g.roles.cache
                    .filter((r) => r.permissions.has(cmdPerms) && !r.managed)
                    .first(10);
                };

                const fullPermissions = command.reduce((accumulator, r) => {
                    const roles = Roles(r.name);

                    if (!roles) return accumulator;

                    const permissions = roles.reduce((a, r) => {
                        return [
                            ...a,
                            {
                                id: r.id,
                                type: "ROLE",
                                permission: true,
                            },
                        ];
                    }, []);

                    return [
                        ...accumulator,
                        {
                            id: r.id,
                            permissions,
                        },
                    ];
                }, []);

                // await g.commands.permissions.set({
                //     fullPermissions,
                // });
            });
        });
    })
}
// const { Perms } = require("../Validation/Permissions");
// const { Client } = require("discord.js");

// /**
//  * 
//  * @param {Client} client 
//  */
// module.exports = async (client, PG, Ascii) => {
//     const Table = new Ascii("Command Loaded!");

//     CommandsArray = [ ];

//     (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
//         const command = require(file);

//         if(!command.name)
//         return Table.addRow(file.split("/")[7], "❌", "Nom manquant.");

//         if (!command.type && !command.description) 
//         return Table.addRow(command.name, "❌", "Description manquante.");

//         if(command.permission) {
//             if(Perms.includes(command.permission))
//             command.defaultPermission = false;
//             else
//             return Table.addRow(command.name, "❌", "Permission invalide.")
//         }
        
//         client.commands.set(command.name, command);
//         CommandsArray.push(command);

//         await Table.addRow(command.name, "✅");
//     });
//     console.log(Table.toString());

//     //// Permissions Check //


//     client.on("ready", async () => {
//         const MainGuild = await client.guilds.cache.get("826823700141572107");

//         MainGuild.commands.set(CommandsArray).then(async (command) => {
//             const Roles = (commandName) => {
//                 const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
//                 if(!cmdPerms) return null;
                
//                 return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
//             }

//             const fullPermissions = command.reduce((accumulator, r) => {
//                 const roles = Roles(r.name);
//                 if(!roles) return accumulator;

//                 const permissions = roles.reduce((a, r) => {
//                     return [...a, {id: r.id, type: "ROLE", permission: true}] 
//                 }, []);

//                 return [...accumulator, {id: r.id, permissions }]
//             }, []);
        
//             await MainGuild.commands.permissions.set({fullPermissions});
//         });
//     });
// }