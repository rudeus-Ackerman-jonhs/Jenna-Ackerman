module.exports = {
  config: {
    name: "shut",
    version: "3.0",
    author: "rudeus Ackerman",
    countDown: 2,
    role: 0,
    shortDescription: "Détecte les insultes et répond avec punchlines",
    category: "fun",
  },

  onStart: async function () {},

  onChat: async function ({ event, api }) {
    const message = event.body.toLowerCase();

    // Dictionnaire : gros mot -> liste de réponses possibles
    const badWordReplies = {
      "cul": [
        "🍑 Un cul bien sec et dur, que veux-tu savoir d'autre ?",
        "😏 T’es passionné par les derrières on dirait.",
        "👖 Mets un caleçon avant d’en parler stp."
      ],
      "pute": [
        "🚨 Oula... ça devient payant ici ?",
        "💄 Appelle-moi Lady Pute alors 😘",
        "👠 La reine des trottoirs est là !"
      ],
      "merde": [
        "💩 Eh bah… voilà une belle crotte bien fraîche !",
        "🧻 Tu veux du papier toilette avec ?",
        "🤢 Ça pue par ici…"
      ],
      "batard": [
        "🍼 Ton papa est au courant ? 😂",
        "👶 Bastard mode activé.",
        "📢 Il manque ton livret de famille gros."
      ],
      "fdp": [
        "📦 Livraison express de FDP détectée 🚚💨",
        "📮 Facture FDP : réglée.",
        "😂 Toujours en promo les FDP."
      ],
      "enculé": [
        "😳 Ah bah… ça doit piquer fort là !",
        "🍌 Doucement sur l’huile, frérot.",
        "🙈 Ouille ouille ouille…"
      ],
      "salope": [
        "👠 Toujours élégante comme d'hab !",
        "😏 On dirait ta tante préférée.",
        "🔥 La championne du quartier !"
      ],
      "connard": [
        "🤡 Monsieur Connard est demandé à l’accueil !",
        "📢 Un vrai diplômé de l’école des connards !",
        "🙃 Tiens, encore un original…"
      ],
      "con": [
        "🧠 Oh… cerveau low-cost détecté.",
        "😂 Con et fier ?",
        "🤡 J’te donne une médaille du con."
      ],
      "nique": [
        "🍌 T’as faim ou quoi ?",
        "🔥 Nique bien, mais hydrate-toi !",
        "😳 Quel romantisme !"
      ],
      "pd": [
        "🌈 Et alors ? Un problème avec les couleurs ?",
        "💅 PD certifié ISO 9001 !",
        "😂 Tu fais partie du club VIP toi."
      ],
      "ta gueule": [
        "🤐 Ferme la tienne d’abord 😏",
        "🔇 On coupe le micro ici !",
        "🙊 Oulala, ça s’énerve vite…"
      ]
    };

    // Vérifie chaque gros mot
    for (let word in badWordReplies) {
      if (message.includes(word)) {
        // Réponse random
        const replies = badWordReplies[word];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        return api.sendMessage(reply, event.threadID, event.messageID);
      }
    }
  }
};