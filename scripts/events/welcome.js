const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "2.0",
    author: "NTKhang + mod Johanna vibes",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      multiple1: "you",
      multiple2: "you guys",

      // pack de styles aléatoires
      welcomeMessages: [
        // ✨ Style Johanna long vibes
        `🙍‍♂️ Salut {userName} 🌟
Le groupe **{boxName}** est honoré de t’accueillir aujourd’hui 🍀.
Ici, c’est plus qu’un simple espace ➟ c’est une famille, un endroit où règnent respect, fun et entraide.
✨ Profite, partage tes vibes, et n’hésite pas à créer de bons souvenirs avec nous 💫.`,

        // ✨ Style clean, organisé
        `╭───❖ 🌹 Bienvenue 🌹 ❖───╮
👤 {userName}  
🌍 Tu viens d’arriver dans ➜ {boxName}

══✦༺🍀༻✦══  
🤝 Ici, respect & bonne ambiance sont de mise.  
✨ Installe-toi bien et profite de ton moment avec nous !  
╰───────────────────╯`
      ]
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType == "log:subscribe")
      return async function () {
        const hours = getTime("HH");
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;

        // si le bot est ajouté
        if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
          if (nickNameBot)
            api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
          return message.send(`Merci de m’avoir invité dans ${threadID} 🍀\nPrefix: ${prefix}\nTape ${prefix}help pour voir mes commandes`);
        }

        if (!global.temp.welcomeEvent[threadID])
          global.temp.welcomeEvent[threadID] = {
            joinTimeout: null,
            dataAddedParticipants: []
          };

        global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
        clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

        global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
          const threadData = await threadsData.get(threadID);
          if (threadData.settings.sendWelcomeMessage == false) return;

          const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
          const dataBanned = threadData.data.banned_ban || [];
          const threadName = threadData.threadName;
          const userName = [],
            mentions = [];
          let multiple = false;

          if (dataAddedParticipants.length > 1) multiple = true;

          for (const user of dataAddedParticipants) {
            if (dataBanned.some(item => item.id == user.userFbId)) continue;
            userName.push(user.fullName);
            mentions.push({ tag: user.fullName, id: user.userFbId });
          }

          if (userName.length == 0) return;

          // sélection aléatoire parmi les messages
          const pack = getLang("welcomeMessages");
          let welcomeMessage = pack[Math.floor(Math.random() * pack.length)];

          welcomeMessage = welcomeMessage
            .replace(/\{userName\}/g, userName.join(", "))
            .replace(/\{boxName\}|\{threadName\}/g, threadName)
            .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
            .replace(/\{session\}/g,
              hours <= 10 ? getLang("session1")
                : hours <= 12 ? getLang("session2")
                  : hours <= 18 ? getLang("session3")
                    : getLang("session4")
            );

          const form = { body: welcomeMessage, mentions };
          message.send(form);
          delete global.temp.welcomeEvent[threadID];
        }, 1500);
      };
  }
}