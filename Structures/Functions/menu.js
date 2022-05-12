const chalk = import(`chalk`);
const { MessageSelectMenu, MessageActionRow } = require(`discord.js`);

const create_mh = (array) => {
    if (!array) throw new Error(chalk.red.bold(`Les options n'ont pas été fournies ! Assurez-vous de fournir toutes les options !`));
    if (array.length < 0) throw new Error(chalk.red.bold(`Le choix doit avoir au moins une chose à sélectionner !`));
    let select_menu;
    let id = `help-menus`;
    let menus = [];
    const emo = {
        info: "❗",
        utility: "⚙️",
        moderation: "🔧",
        developer: "🧑‍💻",
        fun: "🎊",
         // Write your category names instead
    }
    
    array.forEach(cca => {
        let name = cca;
        let sName = `${name.toUpperCase()}`
        let tName = name.toLowerCase();
        let fName = name.toUpperCase();

        return menus.push({
            label: sName,
            description: `${tName} Commands`,
            value: fName
        })
    });

    let smenu1 = new MessageSelectMenu()
        .setCustomId(id)
        .setPlaceholder(`Choose the order category`)
        .addOptions(menus)

    select_menu = new MessageActionRow()
        .addComponents(
            smenu1
        );


    return {
        smenu: [select_menu],
        sid: id
    }
}

module.exports = create_mh;