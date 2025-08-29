const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.0",
    author: "rudeus ackerman",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View command usage and list all commands" },
    longDescription: { en: "View command usage and list all commands with detailed info" },
    category: "info",
    guide: { en: "{pn} [empty | <command name>]" },
    priority: 1
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    // Si aucun argument → liste complète
    if (args.length === 0) {
      const commandsArray = Array.from(commands.values())
        .filter(cmd => cmd.config.role <= role);

      // Grouper par catégories
      const grouped = {};
      for (const cmd of commandsArray) {
        const category = cmd.config.category || "Autres";
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(cmd.config.name);
      }

      let msg = `╭════════════════╮\n│ ✨ 🌹 Itachi AI 🌹 ✨\n╰════════════════╯\n\n`;

      const categories = Object.entries(grouped);
      categories.forEach(([category, cmds], idx) => {
        msg += `       🌿 ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
        for (const c of cmds.sort()) {
          msg += `│ 🍁 ${c}\n`;
        }
        if (idx < categories.length - 1) {
          msg += `─────────\n`;
        }
      });

      msg += `\n╰───────────────╯\n`;
      msg += `⚡ Total : ${commandsArray.length} commandes disponibles\n\n`;
      msg += `👨‍💻 Créateur : 𝗿𝘂𝗱𝗲𝘂𝘀 𝗔𝗰𝗸𝗲𝗿𝗺𝗮𝗻\n`;
      msg += `🔗 fb.com/arminackerman101`;

      await message.reply(msg);
      return;
    }

    // Si l’utilisateur cherche une commande spécifique
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

    let response = `╭════════════════╮\n│ ✨ 🌹 Itachi AI 🌹 ✨\n╰════════════════╯\n\n`;
    response += `╭─❖ Commande : ${cfg.name}\n`;
    response += `│ 🍁 Description : ${longDescription}\n`;
    response += `│ 🍁 Alias : ${cfg.aliases ? cfg.aliases.join(", ") : "Aucun"}\n`;
    response += `│ 🍁 Rôle : ${roleText}\n`;
    response += `│ ⏱️ Cooldown : ${cfg.countDown || 1}s\n`;
    response += `│ 🍁 Auteur : ${cfg.author || "Unknown"}\n`;
    response += `╰────────────────╯\n\n`;
    response += `💡 Usage : ${usage}\n\n`;
    response += `👨‍💻 Créateur : 𝗿𝘂𝗱𝗲𝘂𝘀 𝗔𝗰𝗸𝗲𝗿𝗺𝗮𝗻\n`;
    response += `🔗 fb.com/arminackerman101`;

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