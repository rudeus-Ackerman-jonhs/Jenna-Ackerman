const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "rudeus",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View command usage and list all commands" },
    longDescription: { en: "View command usage and list all commands with detailed info" },
    category: "info",
    guide: { en: "{pn} [empty | <command name> | <page>]" },
    priority: 1
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    // Liste des commandes
    if (args.length === 0 || !isNaN(args[0])) {
      const page = parseInt(args[0]) || 1;
      const commandsArray = Array.from(commands.values())
        .filter(cmd => cmd.config.role <= role)
        .sort((a, b) => a.config.name.localeCompare(b.config.name));

      const perPage = 10;
      const totalPages = Math.ceil(commandsArray.length / perPage);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const cmdsToShow = commandsArray.slice(start, end);

      let msg = `╭════════════════╮\n│ ✨ 🌹Itachi AI🌹 ✨\n╰════════════════╯\n\n`;
      cmdsToShow.forEach(c => {
        msg += `│ 🍁 ${c.config.name}\n`;
      });
      msg += `╰────────────\n\n`;

      if (totalPages > 1) {
        msg += `⚡ Page ${page}/${totalPages} | Tape : help <page> pour voir la suivante\n`;
      }

      await message.reply({ body: msg });
      return;
    }

    // Détails d'une commande
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command) {
      await message.reply(`𝗖𝗠𝗗 "『${commandName}』" 𝗻'𝗲𝘅𝗶𝘀𝘁𝗲 𝗽𝗮𝘀`);
      return;
    }

    const cfg = command.config;
    const roleText = roleTextToString(cfg.role);
    const longDescription = cfg.longDescription?.en || "Aucune description";
    const guideBody = cfg.guide?.en || "Pas de guide disponible";
    const usage = guideBody.replace(/{pn}/g, prefix + cfg.name);

    let response = `╭════════════════╮\n│ ✨ 🌹Itachi AI🌹 ✨\n╰════════════════╯\n\n`;
    response += `╭─❖  Commande : ${cfg.name}\n`;
    response += `│ 🍁 Description : ${longDescription}\n`;
    response += `│ 🍁 Alias : ${cfg.aliases ? cfg.aliases.join(", ") : "Aucun"}\n`;
    response += `│ 🍁 Rôle : ${roleText}\n`;
    response += `│ ⏱️ Cooldown : ${cfg.countDown || 1}s\n`;
    response += `│ 🍁 Auteur : ${cfg.author || "Unknown"}\n`;
    response += `╰────────────────╯\n\n`;
    response += `💡 Usage : ${usage}\n`;

    await message.reply(response);
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "Tous les utilisateurs";
    case 1: return "Administrateurs de groupe";
    case 2: return "Admin du bot";
    default: return "Rôle inconnu";
  }
}