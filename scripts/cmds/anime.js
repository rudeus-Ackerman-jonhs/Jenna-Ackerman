const axios = require("axios");

module.exports = {
  config: {
    name: "anime",
    aliases: ["animelist"],
    version: "1.0",
    author: "RUDEUS ACKERMAN",
    role: 0,
    shortDescription: "Anime selector",
    category: "fun",
    cooldowns: 3,
  },

  onStart: async function ({ api, event }) {
    const menu = `
🌟 Anime Selector 🌟
---------------------

🍁 Waifu
🍁 Husbando
🍁 Sexy
🍁 Couple
🍁 Battle

---------------------
💡 Réponds avec ton choix !`;

    return api.sendMessage(menu, event.threadID, (err, info) => {
      global.client.handleReply.push({
        type: "animeChoice",
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID
      });
    });
  },

  onReply: async function ({ api, event, handleReply }) {
    if (handleReply.type !== "animeChoice") return;
    const choice = event.body.trim().toLowerCase();

    let url = "";
    let category = "";

    switch (choice) {
      case "waifu":
        url = "https://api.waifu.pics/sfw/waifu";
        category = "🍁 Waifu";
        break;
      case "husbando":
        url = "https://nekos.best/api/v2/husbando";
        category = "🍁 Husbando";
        break;
      case "sexy":
        url = "https://api.waifu.pics/nsfw/waifu"; // ⚠️ NSFW
        category = "🍁 Sexy";
        break;
      case "couple":
        url = "https://nekos.best/api/v2/couple";
        category = "🍁 Couple";
        break;
      case "battle":
        url = "https://api.waifu.pics/sfw/bully"; 
        category = "🍁 Battle";
        break;
      default:
        return api.sendMessage("❌ Choix invalide, utilise un élément du menu.", event.threadID, event.messageID);
    }

    try {
      const res = await axios.get(url);
      let img;

      // Selon l’API choisie, la structure des données change :
      if (res.data.url) {
        img = res.data.url;
      } else if (res.data.results && res.data.results[0].url) {
        img = res.data.results[0].url;
      } else {
        img = res.data[0]?.url || null;
      }

      if (!img) return api.sendMessage("❌ Impossible de charger l’image.", event.threadID);

      return api.sendMessage(
        {
          body: `✅ Voilà c’est fait !\nTu as choisi ${category}\n\n✨ Merci d’avoir utilisé anime.js`,
          attachment: await global.utils.getStreamFromURL(img)
        },
        event.threadID,
        event.messageID
      );
    } catch (e) {
      return api.sendMessage("⚠️ Erreur lors de la récupération de l’image.", event.threadID, event.messageID);
    }
  }
};