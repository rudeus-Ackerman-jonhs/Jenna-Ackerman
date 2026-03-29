const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const PAGE_SIZE = 10;
const replyStore = new Map();

module.exports = {
  config: {
    name: "help",
    version: "4.0",
    author: "rudeus ackerman",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View commands" },
    longDescription: { en: "View commands with pagination" },
    category: "info",
    guide: { en: "{pn} [empty | <command name>]" }
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID, senderID } = event;
    const prefix = getPrefix(threadID);

    // ===== CAS 1 : LISTE =====
    if (args.length === 0) {
      return sendPage(message, threadID, senderID, role, 1, prefix);
    }

    // ===== CAS 2 : DÉTAIL COMMANDE =====
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command) {
      return message.reply(`❌ La commande "${commandName}" n'existe pas.`);
    }

    const cfg = command.config;
    const usage = (cfg.guide?.en || "").replace(/{pn}/g, prefix + cfg.name);

    let msg = `
╔════════════════════╗
   📚 CLEVER 🌹
╚════════════════════╝

Hmm… tu veux creuser cette commande 😏  
Bonne idée.

╭─❖ Commande : ${cfg.name}
│ 🍁 Description : ${cfg.longDescription?.en || "Aucune description"}
│ 🍁 Alias : ${cfg.aliases ? cfg.aliases.join(", ") : "Aucun"}
│ 🍁 Catégorie : ${cfg.category || "Autres"}
│ 🍁 Accès : ${roleText(cfg.role)}
│ ⏱️ Cooldown : ${cfg.countDown || 1}s
│ 🍁 Auteur : ${cfg.author || "Unknown"}
╰────────────────╯

💡 Utilisation :
➤ ${usage || prefix + cfg.name}

───────────────
Je suis curieux… tu vas tester ou juste regarder ? 😏
`;

    return message.reply(msg);
  },

  onReply: async function ({ event, message }) {
    const data = replyStore.get(event.messageReply.messageID);
    if (!data) return;

    if (event.senderID !== data.author) return;

    const page = parseInt(event.body);
    if (isNaN(page)) return;

    replyStore.delete(event.messageReply.messageID);

    return sendPage(message, event.threadID, event.senderID, data.role, page, data.prefix);
  }
};

// ===== FONCTION PAGE =====
async function sendPage(message, threadID, senderID, role, page, prefix) {
  const cmds = Array.from(commands.values())
    .filter(cmd => cmd.config.role <= role);

  const totalPages = Math.ceil(cmds.length / PAGE_SIZE);
  if (page < 1 || page > totalPages) return;

  const start = (page - 1) * PAGE_SIZE;
  const current = cmds.slice(start, start + PAGE_SIZE);

  // Grouper par catégorie
  const grouped = {};
  for (const cmd of current) {
    const cat = cmd.config.category || "Autres";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(cmd.config.name);
  }

  let msg = `
╔════════════════════╗
   📚 CLEVER 🌹
╚════════════════════╝

Tu cherches à comprendre mes capacités… intéressant 😏
`;

  for (const [cat, list] of Object.entries(grouped)) {
    msg += `\n🌿 ${capitalize(cat)}\n`;
    for (const name of list.sort()) {
      msg += `➤ ${name}\n`;
    }
  }

  msg += `
───────────────
📜 Page ${page} / ${totalPages}
💬 Reply "${page + 1}" pour continuer
───────────────

🧠 "Tout savoir n’est rien… savoir utiliser, c’est tout."
`;

  const sent = await message.reply(msg);

  replyStore.set(sent.messageID, {
    author: senderID,
    page,
    role,
    prefix
  });
}

// ===== UTIL =====
function roleText(role) {
  switch (role) {
    case 0: return "Tous les utilisateurs";
    case 1: return "Admins du groupe";
    case 2: return "Admin bot";
    default: return "Inconnu";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}