module.exports = {
  config: {
    name: "resend",
    version: "1.0.0",
    author: "Itachi Mod",
    role: 0,
    category: "fun",
    shortDescription: "Renvoie les messages supprimés avec un clash 😏",
  },

  onMessageDeleted: async function ({ api, event }) {
    try {
      const { threadID, messageID, senderID } = event;

      // Récupère l'historique du message supprimé
      const history = await api.getMessageInfo(messageID);
      if (!history || !history.message) return;

      const deletedMsg = history.message;
      const userInfo = await api.getUserInfo(senderID);
      const username = userInfo[senderID]?.name || "Quelqu'un";

      // Style Itachi Clash
      const resendMsg = `
╭─⊙『 🚨𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗲𝗳𝗳𝗮𝗰𝗲́ 』
│
│ 🤨 Heo @${username}... tu crois nous cacher quoi là ? 🥲
│ 💬 Voilà ce que t’as voulu supprimer : 
│  
│    🍁🍁 "${deletedMsg}" 🍁🍁
│
│ 😏 Pas de secret ici, poto.
│ Je montre à tous 🤣
╰────────────⊙
      `.trim();

      // Envoie le message avec mention
      api.sendMessage(
        {
          body: resendMsg,
          mentions: [{ tag: username, id: senderID }]
        },
        threadID
      );
    } catch (err) {
      console.error("❌ Erreur resend:", err);
    }
  }
};