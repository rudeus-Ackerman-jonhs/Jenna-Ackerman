const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    aliases: ["aide", "menu"],
    version: "2.0",
    author: "🏌️",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Display help and usage",
      fr: "Affiche la liste des commandes"
    },
    longDescription: {
      en: "List all commands or get help for a specific one",
      fr: "Affiche la liste de toutes les commandes ou l'aide d'une commande spécifique"
    },
    category: "info",
    guide: {
      en: "{pn} / help <command>\n{pn} -c <category>",
      fr: "{pn} / help <commande>\n{pn} -c <catégorie>"
    }
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "𝐀𝐋𝐘𝐀. 𝐂𝐌𝐃𝐒\n";

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Autres";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      for (const cat of Object.keys(categories)) {
        msg += `🍂✨\n${cat.toUpperCase()} ✨🍂\n`;
        categories[cat].sort().forEach(cmd => {
          msg += ` 🎊${cmd}🎊\n`;
        });
        msg += "\n";
      }

      const adminMentions = global.GoatBot.config.adminBot.map(id => ({ id, tag: `@admin` }));
      const adminTags = adminMentions.map(ad => `• ${ad.tag} (${ad.id})`).join("\n");

      msg += `🤖| ᎯᏝᎽᎯ 𝐝𝐢𝐬𝐩𝐨𝐬𝐞 𝐚𝐜𝐭𝐮𝐞𝐥𝐥𝐞𝐦𝐞𝐧𝐭 𝐝𝐞 🍂${commands.size}🍂 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞𝐬.\n`;
      msg += `⚙️|𝐒𝐚𝐢𝐬𝐢𝐬 ${prefix}𝐡𝐞𝐥𝐩 𝐬𝐮𝐢𝐯𝐢 𝐝𝐮 𝐧𝐨𝐦 𝐝𝐞 𝐥𝐚 𝐜𝐦𝐝 𝐩𝐨𝐮𝐫 𝐩𝐥𝐮𝐬 𝐝𝐞 𝐝𝐞𝐭𝐚𝐢𝐥𝐬 𝐬𝐮𝐫 𝐥𝐚 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞.\n`;
      msg += `\n\n🤖 ᏰᎾᎿ  ᏁᎯᎷᎬ   : ᎯᏝᎽᎯ  ᏰᎾᎿ`;
      msg += `\n👑 ᎯᎠᎷᎨᏁ  (Ꮥ)  ᏰᎾᎿ   :\n${adminTags}`;
      msg += `\n\n𝐇𝐞𝐥𝐥𝐨 𝐥'𝐚𝐦𝐢 (𝐞) 👋 𝐫𝐞𝐣𝐨𝐢𝐧𝐬 𝐦𝐨𝐧 𝐠𝐫𝐨𝐮𝐩𝐞 𝐞𝐧 𝐮𝐭𝐢𝐥𝐢𝐬𝐚𝐧𝐭 𝐥𝐚 𝐜𝐦𝐝 ${prefix}𝐚𝐥𝐲𝐚𝐠𝐜. `;

      return message.reply({
        body: msg,
        mentions: adminMentions
      });
    }

    // Affichage par catégorie
    if (args[0] === "-c") {
      if (!args[1]) return message.reply("❌ Spécifie une catégorie.");
      const categoryName = args[1].toLowerCase();

      const filtered = Array.from(commands.values()).filter(cmd =>
        cmd.config.category?.toLowerCase() === categoryName
      );

      if (filtered.length === 0) return message.reply(`❌ Aucune commande trouvée dans "${categoryName}".`);

      let msg = `╔══════════════╗\n📂 CATÉGORIE : ${categoryName.toUpperCase()}\n╚══════════════╝\n`;
      filtered.forEach(cmd => msg += `✯ ${cmd.config.name}\n`);

      return message.reply(msg);
    }

    // Aide sur une commande spécifique
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.get(aliases.get(name));

    if (!command) return message.reply(`❌ La commande "${name}" est introuvable.`);

    const config = command.config;
    const roleMap = {
      0: "Tous les utilisateurs",
      1: "Admins du groupe",
      2: "Admins du bot"
    };

    let msg = `╭──── ${config.name.toUpperCase()} ────⭓\n`;
    msg += `│ 📄 Description : ${config.longDescription?.fr || "Aucune"}\n`;
    msg += `│ 📁 Catégorie : ${config.category || "Autres"}\n`;
    msg += `│ 🧑 Auteur : ${config.author || "Inconnu"}\n`;
    msg += `│ 🆔 Nom(s) alternatif(s) : ${config.aliases?.join(", ") || "Aucun"}\n`;
    msg += `│ 🕒 Cooldown : ${config.countDown || 1}s\n`;
    msg += `│ 🔐 Accès : ${roleMap[config.role] || "Inconnu"}\n`;
    msg += `├──── 🧭 UTILISATION ────\n`;
    msg += `│ ${config.guide?.fr?.replace(/{pn}/g, prefix + config.name) || "Non défini"}\n`;
    msg += `╰───────────────⭓`;

    return message.reply(msg);
  }
};
