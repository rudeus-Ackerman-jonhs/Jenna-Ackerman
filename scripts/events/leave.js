const { getTime, drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "2.0",
    author: "rudeus ackerman",
    category: "events"
  },

  langs: {
    en: {
      session1: "matin",
      session2: "midi",
      session3: "après-midi",
      session4: "soir",
      // Messages quand l’utilisateur part de lui-même
      leaveMessages: [
        "💔 {userName} a quitté le navire… Il/elle n’a pas supporté nos bêtises et a sauté par-dessus bord ⛵🐟",
        "🔥 {userName} a disparu, consumé par les flammes de l’oubli…",
        "👻 {userName} est parti… mais son inutilité hantera encore ce groupe.",
        "🪦 Nom : {userName}\nÂge : on s'en fout 🧑‍🦯\nCause : trop inutile, consumé par les flammes de l’enfer 🍁",
        "🤡 {userName} n’a pas supporté nos blagues et a ragequit.\nAh… suspense, qui sera le prochain ? 👀"
      ],
      // Messages quand il est expulsé
      kickMessages: [
        "🚪 {userName} a été jeté dehors comme un sac poubelle 🗑️",
        "🔥 Rituel terminé : {userName} a été sacrifié aux flammes 🔥",
        "🪦 {userName} déclaré officiellement mort socialement, expulsion réussie ✅",
        "⚰️ {userName} a été chassé du groupe… inutilité confirmée 🥴",
        "🚫 {userName} expulsé pour inactivité chronique. RIP 👋"
      ]
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType == "log:unsubscribe") {
      return async function () {
        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        if (!threadData.settings.sendLeaveMessage) return;

        const { leftParticipantFbId } = event.logMessageData;
        if (leftParticipantFbId == api.getCurrentUserID()) return;

        const hours = getTime("HH");
        const threadName = threadData.threadName;
        const userName = await usersData.getName(leftParticipantFbId);

        // Détermine type : quitté ou kick
        const leftBySelf = leftParticipantFbId == event.author;
        const typeMessage = leftBySelf ? "a quitté le groupe" : "a été expulsé";

        // Choix du message fun selon le type
        const messagesList = leftBySelf ? getLang("leaveMessages") : getLang("kickMessages");
        const funMessage = messagesList[Math.floor(Math.random() * messagesList.length)];

        // Remplace les variables dynamiques dans funMessage
        const funMsgParsed = funMessage.replace(/\{userName\}/g, userName);

        // Détermine session
        const session = hours <= 10 ? getLang("session1") :
          hours <= 12 ? getLang("session2") :
            hours <= 18 ? getLang("session3") : getLang("session4");

        // Cadre final
        const finalMessage = `
╭───────────────
│ ⚰️  Avis de décès du groupe ⚰️
├───────────────
│ 👤 Nom : ${userName}            
│ 📌 Groupe : ${threadName}       
│ 🕒 Heure : ${hours}h ${session}   
│ 📜 Statut : ${typeMessage}      
│                               
│ ${funMsgParsed}                  
╰───────────────
        `;

        const form = { body: finalMessage };

        if (threadData.data.leaveAttachment) {
          const files = threadData.data.leaveAttachment;
          const attachments = files.reduce((acc, file) => {
            acc.push(drive.getFile(file, "stream"));
            return acc;
          }, []);
          form.attachment = (await Promise.allSettled(attachments))
            .filter(({ status }) => status == "fulfilled")
            .map(({ value }) => value);
        }

        message.send(form);
      };
    }
  }
};
