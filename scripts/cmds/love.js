 const loveResults = {}; // stockage des résultats déjà donnés

module.exports = {
  config: {
    name: "love",
    version: "2.0",
    author: "Bro",
    countDown: 5,
    role: 0,
    shortDescription: "Test d'amour stylisé",
    longDescription: "Calcule un pourcentage d'amour entre deux personnes et donne un message drôle",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event, usersData }) {
    const senderID = event.senderID;
    const senderName = (await usersData.getName(senderID)) || "Toi";

    // Vérifie si une personne est mentionnée
    const mentionID = Object.keys(event.mentions)[0];

    if (!mentionID) {
      return message.reply("🥲💔 Tu veux t'aimer toi même ⁉️... faut chercher quelqu'un qui va supporter tes bêtises");
    }

    const mentionName = event.mentions[mentionID];

    // Générer une clé unique pour ce couple (peu importe l'ordre)
    const coupleKey = [senderID, mentionID].sort().join("-");

    // Vérifie si un résultat existe déjà
    let pourcentage;
    if (loveResults[coupleKey]) {
      pourcentage = loveResults[coupleKey];
    } else {
      pourcentage = Math.floor(Math.random() * 99) + 1; // 1-99
      loveResults[coupleKey] = pourcentage;
    }

    // Messages selon le score
    let resultMessage = "";
    if (pourcentage <= 10) resultMessage = `🤦 Friendzone direct... ${senderName} oublie ça et concentre-toi sur la bouffe 🍔`;
    else if (pourcentage <= 20) resultMessage = `😂 Vous êtes encore amis, ${senderName}... ne t'emballe pas 🌬️🍁`;
    else if (pourcentage <= 30) resultMessage = `🥲 ${senderName}, si c'est pas courir après quelqu'un je sais pas c'est quoi...`;
    else if (pourcentage <= 40) resultMessage = `🤦 Toi-même tu vois combien tes chances sont maigres... c'est une perte de temps 💔`;
    else if (pourcentage <= 50) resultMessage = `🍁 Ça peut aller... mais ${senderName} faut courir après ton âme sœur hein 🌬️`;
    else if (pourcentage <= 60) resultMessage = `😝 ${mentionName} t'aime en secret... n'abandonne pas jamais !`;
    else if (pourcentage <= 70) resultMessage = `🥲💍 J'imagine le mariage entre ${senderName} et ${mentionName}... On mange quoi le jour J ?`;
    else if (pourcentage <= 80) resultMessage = `😂 Dans une autre dimension ${senderName} et ${mentionName} ont 3 enfants et un hamster 🐹`;
    else if (pourcentage <= 90) resultMessage = `🧑‍🦯 ${mentionName} ne sait même pas combien tu l'aimes ${senderName}...`;
    else resultMessage = `😅🥲 Si on me demande de définir l'amour... je cite ${senderName} et ${mentionName} 💖`;

    // Message stylisé avec cadre
    const replyMessage = 
`╭─⌾💞𝙻𝙾𝚅𝙴 𝚃𝙴𝚂𝚃💞
│🍁| 𝚂𝚎𝚗𝚍𝚎𝚛: 【 ${senderName} 】
│🌿| 𝙼𝚎𝚗𝚝𝚒𝚘𝚗𝚎́: 【 ${mentionName} 】
│💖| 𝚂𝚌𝚘𝚛𝚎: 【 ${pourcentage}% 】
╰──────────⌾

📜 𝚁𝚎́𝚜𝚞𝚕𝚝𝚊𝚝: ${resultMessage}`;

    message.reply(replyMessage, {
      mentions: [
        { id: senderID, tag: senderName },
        { id: mentionID, tag: mentionName }
      ]
    });
  }
};