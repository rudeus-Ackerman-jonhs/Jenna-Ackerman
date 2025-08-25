module.exports = {
  config: {
    name: "nickbot",
    version: "1.1",
    author: "Loid Butter + GPT",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Change group name or bot nickname"
    },
    longDescription: {
      en: "Change the group chat name (current only) or bot nickname (all groups)"
    },
    category: "owner",
    guide: {
      en: "{pn} → shows menu\n{pn} 1 <new group name>\n{pn} 2 <new bot nickname>"
    }
  },

  onStart: async function({ api, args, threadsData, message }) {
    // Si aucun argument → on affiche le menu
    if (args.length === 0) {
      return message.reply(
        "╭─⌾⚙️ 𝙽𝙸𝙲𝙺𝙱𝙾𝚃 ⚙️⌾─╮\n" +
        "│ 1️⃣ Changer le nom du groupe\n" +
        "│ 2️⃣ Changer le surnom du bot (TOUS les groupes)\n" +
        "╰──────────────⌾"
      );
    }

    const option = args[0];
    const newName = args.slice(1).join(" ");

    if (!newName) {
      return message.reply("⚠️ Merci de préciser le nouveau nom après le choix.");
    }

    // Option 1 → changer nom du groupe
    if (option === "1") {
      try {
        await api.setTitle(newName, message.threadID);
        return message.reply(`✅ Le nom du groupe a été changé en : ${newName}`);
      } catch (err) {
        return message.reply("❌ Erreur en changeant le nom du groupe : " + err.message);
      }
    }

    // Option 2 → changer surnom du bot dans TOUS les groupes
    if (option === "2") {
      try {
        const allThreads = (await threadsData.getAll())
          .filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);

        const threadIds = allThreads.map(thread => thread.threadID);

        let success = 0;
        let failed = 0;

        for (const threadId of threadIds) {
          try {
            await api.changeNickname(newName, threadId, api.getCurrentUserID());
            success++;
          } catch (e) {
            failed++;
          }
        }

        return message.reply(`✅ Surnom du bot changé en **${newName}** dans ${success} groupes.\n❌ Échec dans ${failed} groupes.`);
      } catch (err) {
        return message.reply("❌ Erreur en changeant les surnoms : " + err.message);
      }
    }

    return message.reply("⚠️ Option invalide. Choisis `1` ou `2`.");
  }
};