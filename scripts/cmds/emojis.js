module.exports = {
  config: {
    name: "emojis",
    aliases: ["emoji", "clash"],
    version: "2.0",
    author: "rudeus Ackerman",
    countDown: 5,
    role: 0,
    shortDescription: "Détecte les emojis et répond avec un clash doux",
    longDescription: "Le bot répond automatiquement par un clash taquin quand un utilisateur envoie un ou plusieurs emojis sans texte.",
    category: "reply"
  },

  onStart: async function () {},

  onChat: async function ({ api, event, message }) {
    const msg = event.body.trim();

    // Vérifie si le message contient uniquement des emojis
    const emojiRegex = /^[\p{Emoji}\u200d\s]+$/u;
    if (!emojiRegex.test(msg)) return;

    // Dictionnaire plus riche
    const emojiClash = {
      "😂": ["Tu rigoles comme un fou toi 😂", "Toi tu dois être le clown du quartier 🤡", "Rire gratuit sponsorisé par toi 😂"],
      "😭": ["Toujours en train de pleurer wesh 🍼", "C’est qui encore qui t’a giflé ? 😭", "Tes larmes là peuvent remplir une piscine 🏊"],
      "❤️": ["Ton cœur là, tu le donnes à tout le monde hein 💔", "Même Facebook a pas autant de cœurs que toi ❤️", "Arrête d’aimer, deviens sérieux un peu 😏"],
      "😎": ["Faux bg spotted 😏", "Eh lunettes noires, enlève ça t’es dans l’ombre 🌚", "Toi tu forces ton style bg là 😎"],
      "🤔": ["Réfléchis pas trop, tu vas cramer ton cerveau 🤯", "Eh philosophe de quartier calme-toi 🤔", "Ton cerveau chauffe trop pour rien 🥵"],
      "😡": ["Toujours fâché comme si tu payes nos factures 😡", "Ton emoji rouge fait même pas peur 😂", "Respire, tu vas exploser 💣"],
      "😏": ["Eh regard vicieux là 😏", "Tu penses à des bêtises encore hein 😏", "Ce sourire-là cache rien de bon 👀"],
      "💀": ["Mort de rire, t’es mort depuis quand ? 💀", "Zombie activé 🧟", "T’as cru tu fais peur ? Skeleton man 💀"],
      "🥶": ["Toi tu fais genre tu es ice, mais en vrai t’es bouillant 🔥", "Ton froid là c’est juste la clim 😅", "Glace qui fond au soleil ☀️🥶"],
      "😴": ["Dors bien, flemmard officiel 😴", "Toujours fatigué comme si tu travailles à la mine ⛏️", "Tu ronfles même en emoji 😴"],
      "🤡": ["Clown certifié 🎪", "T’as encore sorti ton nez rouge 🤡", "Tu fais rire mais c’est toi le spectacle 🤡"],
      "👀": ["Tu regardes quoi comme ça 👀", "Les yeux partout sauf dans ta vie 👀", "Arrête d’espionner, CIA de quartier 👀"],
      "🔥": ["Toi tu brûles mais c’est que dans WhatsApp 🔥", "Toujours à mettre le feu pour rien 🔥", "Ton feu là chauffe même pas mon thé ☕"],
      "💔": ["Encore un cœur cassé ? Tu collectionnes 💔", "Tes relations tiennent moins qu’un crédit Orange 💔", "Ton cœur c’est une mosaïque maintenant 💔"],
      "🤮": ["Beurk, va nettoyer ta bouche 🤮", "Même ton emoji pue 🤢", "Tu vomis quoi encore ? Tes excuses ? 🤮"],
      "🤯": ["Tête explosée mais rien dans le cerveau 💥", "Ton cerveau lag trop 🤯", "Encore une idée qui t’a détruit 🤯"],
      "🥴": ["T’as encore bu toi hein 🍺🥴", "État instable détecté 🥴", "Même ton emoji titube 🥴"],
      "😜": ["Toujours la langue dehors, c’est fatiguant 😜", "Tu crois que c’est mignon mais non 😝", "Emoji enfantin détecté 😜"],
      "😒": ["Toujours vexé comme un bébé 😒", "Ton facepalm est enregistré 😒", "Regard blasé depuis 2010 😒"],
      "🙄": ["Roulement d’yeux professionnel 🙄", "Tu lèves trop les yeux, tu verras les anges bientôt 👼", "Ton emoji blasé, on dirait ton vrai visage 🙄"],
      "😇": ["Saint hypocrite activé 😇", "Arrête de faire l’ange, on connaît ton dossier 😈", "Emoji d’église mais cœur de démon 😇"],
      "😈": ["Petit démon du quartier 😈", "Fais le malin mais tu dors la lumière allumée 😈", "Toi et ton smiley violet là 🙃"],
      "🤡": ["Clown confirmé 🤡", "Direct au cirque 🎪", "Toi même ton reflet se moque 🤡"],
      "🤑": ["Toujours argent dans la bouche mais portefeuille vide 🤑", "Tu cries 'argent' mais t’as pas 1000 CFA 🤑", "Ton emoji riche mais ton compte est pauvre 🤑"],
      "😤": ["Tu souffles trop pour rien 😤", "Respire doucement tu vas tomber 😤", "Emoji vexé mais faible 😤"],
      "😩": ["Fatigué chronique 😩", "Toujours à soupirer comme une vieille 😩", "Ton emoji est KO, comme toi 😩"]
    };

    // Cherche les emojis envoyés dans le message
    const emojisInMsg = [...msg].filter(char => emojiClash[char]);

    if (emojisInMsg.length > 0) {
      const chosenEmoji = emojisInMsg[Math.floor(Math.random() * emojisInMsg.length)];
      const responses = emojiClash[chosenEmoji];
      const randomClash = responses[Math.floor(Math.random() * responses.length)];

      api.setMessageReaction("🔥", event.messageID, () => {}, true);
      return message.reply(randomClash);
    }
  }
};