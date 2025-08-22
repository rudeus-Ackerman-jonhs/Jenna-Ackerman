const axios = require("axios");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "original",
    aliases: ["cover", "albumart"],
    version: "1.0",
    author: "Rudeus Ackerman",
    role: 0,
    description: "Obtenir la cover originale d’une musique",
    category: "media",
    cooldown: 5,
  },

  onStart: async function ({ api, args, event }) {
    try {
      if (args.length === 0) {
        return api.sendMessage("❌ | Donne le titre d’une musique bro !", event.threadID, event.messageID);
      }

      const query = args.join(" ");
      const msg = await api.sendMessage(`🔎 Recherche de **${query}**...`, event.threadID, event.messageID);

      const r = await yts(query);
      if (!r.videos.length) {
        return api.sendMessage("❌ | Aucune musique trouvée.", event.threadID, event.messageID);
      }

      const video = r.videos[0]; // premier résultat
      const title = video.title;
      const artist = video.author.name;
      const duration = video.timestamp;
      const date = video.ago;
      const link = video.url;

      // Cover HD officielle (pas floutée)
      const coverUrl = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

      // Message stylé
      const info = `
⋆─────━✧✦✧━─────⋆
      🎶 MUSIC COVER 🎶
⋆─────━✧✦✧━─────⋆
🎵 Titre     : ${title}
👤 Artiste   : ${artist}
⏱️ Durée     : ${duration}
📅 Date      : ${date}
🌐 Lien      : ${link}
⋆─────━✧✦✧━─────⋆
✨ Bot by RUDEUS ACKERMAN
⋆─────━✧✦✧━─────⋆
`;

      await api.unsendMessage(msg.messageID);

      return api.sendMessage(
        {
          body: info,
          attachment: await global.utils.getStreamFromURL(coverUrl),
        },
        event.threadID,
        event.messageID
      );
    } catch (e) {
      return api.sendMessage("❌ | Erreur : " + e.message, event.threadID, event.messageID);
    }
  },
};