const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name:"arielgc",
    aliases: ["itachigc","rudeusgc"],
    version: "1.1",
    author: "AceGun + modifié",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "add user in thread"
    },
    longDescription: {
      vi: "",
      en: "add any user to bot owner group chat"
    },
    category: "GroupMsg",
    guide: {
      en: "{pn}sonicgc"
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = "1282174240033343";
    const username = event.senderID;
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs;

      if (participants.includes(event.senderID)) {
        api.sendMessage(
`╭─🍀『 📌 𝗜𝗻𝗳𝗼 𝗚𝗿𝗼𝘂𝗽𝗲 』🍀───╮
│ ✨ Heo @${username}, t’es déjà dans le groupe !
│ 📩 Si tu le vois pas, vérifie ta boîte spam.
╰────────────🍀`,
          event.threadID,
          () => api.setMessageReaction("⚠", event.messageID, () => {}, true),
          event.messageID
        );
      } else {
        await api.addUserToGroup(event.senderID, threadID);
        api.sendMessage(
`╭─🕊️『 ✅ 𝗔𝗷𝗼𝘂𝘁 𝗥𝗲𝘂𝘀𝘀𝗶 』🕊️───╮
│ 🎉 Bienvenue @${username} !
│ 🚀 Tu viens d’être ajouté au groupe.
│ 📩 Vérifie tes messages si tu le trouves pas.
╰────────────🕊️`,
          event.threadID,
          () => api.setMessageReaction("🍀", event.messageID, () => {}, true),
          event.messageID
        );
      }
    } catch (error) {
      api.sendMessage(
`╭─⚠️『 ❌ 𝗘𝗰𝗵𝗲𝗰 』⚠️───╮
│ 😢 Désolé @${username}...
│ 💬 Impossible de t’ajouter au groupe.
│ 🔎 Vérifie si les ajouts sont activés.
╰────────────⚠️`,
        event.threadID,
        () => api.setMessageReaction("🙆‍♂️", event.messageID, () => {}, true),
        event.messageID
      );
    }
  }
};