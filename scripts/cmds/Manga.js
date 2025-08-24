const axios = require("axios");

let games = {};

module.exports = {
  config: {
    name: "manga",
    version: "1.0",
    author: "Rudeus Ackerman",
    category: "games"
  },

  onStart: async ({ message, event, args, usersData }) => {
    if (args[0] === "start") {
      const threadID = event.threadID;
      if (games[threadID]) return message.reply("⚠️ Une partie est déjà en cours !");
      games[threadID] = {
        players: {},
        stage: "waiting",
        questions: [],
        current: 0,
        scores: {}
      };

      return message.reply(
        "╭── INSCRIPTIONS ──╮\n" +
        "📢 Tapez P1, P2, P3 ou P4 pour rejoindre !\n" +
        "👉 Il faut 4 joueurs (3 minutes max)\n" +
        "╰─────────────────╯"
      );

    } else {
      return message.reply("👉 Utilise : manga start");
    }
  },

  onReply: async ({ message, event, Reply, usersData }) => {
    const threadID = event.threadID;
    const game = games[threadID];
    if (!game) return;

    const name = await usersData.getName(event.senderID);

    // Gestion inscriptions
    if (game.stage === "waiting") {
      const slot = event.body.toUpperCase();
      if (!["P1", "P2", "P3", "P4"].includes(slot)) return;
      if (Object.values(game.players).includes(event.senderID))
        return message.reply("⚠️ Tu es déjà inscrit !");
      if (game.players[slot])
        return message.reply("⚠️ Cette place est déjà prise !");

      game.players[slot] = event.senderID;
      game.scores[event.senderID] = 0;

      // Affiche inscriptions
      let txt =
        "╭── INSCRIPTIONS ──╮\n";
      for (let p of ["P1", "P2", "P3", "P4"]) {
        txt += `${p}: ${game.players[p] ? await usersData.getName(game.players[p]) : "—"}\n`;
      }
      txt += "╰─────────────────╯";

      await message.reply(txt);

      if (Object.keys(game.players).length === 4) {
        game.stage = "playing";

        // Charger les questions
        const res = await axios.get(
          "https://opentdb.com/api.php?amount=15&category=31&type=multiple" // category 31 = Anime & Manga
        );
        game.questions = res.data.results;

        askQuestion(message, game, threadID);
      }
    }

    // Réponses aux questions
    else if (game.stage === "playing") {
      const currentQ = game.questions[game.current];
      if (!currentQ) return;

      const choice = event.body.trim().toUpperCase();
      const valid = ["A", "B", "C", "D"];
      if (!valid.includes(choice)) return;

      if (!game.answers) game.answers = {};
      if (game.answers[event.senderID]) return message.reply("⚠️ Tu as déjà répondu !");

      game.answers[event.senderID] = choice;

      // Quand tous ont répondu
      if (Object.keys(game.answers).length === 4) {
        showResults(message, game, threadID);
      }
    }
  }
};

// Pose une question
async function askQuestion(message, game, threadID) {
  game.answers = {};
  const q = game.questions[game.current];

  let opts = [...q.incorrect_answers, q.correct_answer];
  opts = shuffle(opts);

  game.correct = String.fromCharCode(65 + opts.indexOf(q.correct_answer));

  let txt =
    "╭── QUESTION ──╮\n" +
    `❓ ${decodeHtml(q.question)}\n\n` +
    `A) ${decodeHtml(opts[0])}\n` +
    `B) ${decodeHtml(opts[1])}\n` +
    `C) ${decodeHtml(opts[2])}\n` +
    `D) ${decodeHtml(opts[3])}\n` +
    "👉 Répondez A, B, C ou D\n" +
    "╰──────────────╯";

  await message.reply(txt);
}

// Affiche résultats d'une question
async function showResults(message, game, threadID) {
  let winner = [], late = [], fail = [];

  for (let [slot, uid] of Object.entries(game.players)) {
    const ans = game.answers[uid];
    if (!ans) late.push(await message._api.getUserInfo(uid).then(i => i[uid].name));
    else if (ans === game.correct) {
      game.scores[uid]++;
      winner.push(await message._api.getUserInfo(uid).then(i => i[uid].name));
    } else fail.push(await message._api.getUserInfo(uid).then(i => i[uid].name));
  }

  let txt =
    "✦━━ SCORE ━━✦\n" +
    `🥇 Correct : ${winner.join(", ") || "—"}\n` +
    `⏱️ Tardifs : ${late.join(", ") || "—"}\n` +
    `💥 Faux : ${fail.join(", ") || "—"}\n` +
    "✦━━━━━━━━━✦";

  await message.reply(txt);

  game.current++;
  if (game.current < game.questions.length) {
    setTimeout(() => askQuestion(message, game, threadID), 2000);
  } else {
    endGame(message, game);
    delete games[threadID];
  }
}

// Fin du jeu
async function endGame(message, game) {
  let final = "📊 Résultats finaux :\n";
  for (let [slot, uid] of Object.entries(game.players)) {
    final += `- ${await message._api.getUserInfo(uid).then(i => i[uid].name)} ➝ ${game.scores[uid]} pts\n`;
  }

  final += "\n🔥 Merci d’avoir joué !\n👉 Tapez « arielgc » pour rejoindre le groupe officiel 🎉";

  await message.reply(final);
}

// Utils
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function decodeHtml(str) {
  return str.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");
}
