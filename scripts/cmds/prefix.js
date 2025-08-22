const fs = require("fs-extra");
const { utils } = global;
const axios = require("axios");

module.exports = {
    config: {
        name: "prefix",
        version: "2.1",
        author: "Rudeus & Itachi",
        countDown: 5,
        role: 0,
        description: "Affiche ou modifie le préfixe du bot",
        category: "config"
    },

    langs: {
        en: {
            reset: "Your prefix has been reset to default: %1",
            onlyAdmin: "Only admin can change the system bot prefix",
            confirmGlobal: "React to confirm changing the system bot prefix",
            confirmThisThread: "React to confirm changing the prefix for this group",
            successGlobal: "System bot prefix changed to: %1",
            successThisThread: "Prefix in this group changed to: %1",
            myPrefix: 
`╭─🩸『  𝗣𝗿𝗲𝗳𝗶𝘅 』🩸───╮
│
│ 🌐 Système ➝ %1
│ 🛸 Groupe  ➝ %2
│
╰────────────🩸

╭─🩸『 👑 𝗔𝗱𝗺𝗶𝗻𝘀 』🩸───╮
│ ⚔️ R𝗎𝗱𝖾𝗎𝗌 𝔸𝖈𝗸𝗲𝗋𝗆𝖺𝗇  
│ 🔗 fb.com/arminackerman101
│
│ 🔥 𝗜𝘁𝗮𝗰𝗵𝗶 𝗖𝗹𝗲𝘃𝗲𝗿  
│ 🔗 fb.com/profile.php?id=61578783617335
╰────────────🩸`
        }
    },

    onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
        if (!args[0])
            return message.SyntaxError();

        if (args[0] == 'reset') {
            await threadsData.set(event.threadID, null, "data.prefix");
            return message.reply(getLang("reset", global.GoatBot.config.prefix));
        }

        const newPrefix = args[0];
        const formSet = {
            commandName,
            author: event.senderID,
            newPrefix
        };

        if (args[1] === "-g") {
            if (role < 2)
                return message.reply(getLang("onlyAdmin"));
            else
                formSet.setGlobal = true;
        } else formSet.setGlobal = false;

        return message.reply(
            args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"),
            (err, info) => {
                formSet.messageID = info.messageID;
                global.GoatBot.onReaction.set(info.messageID, formSet);
            }
        );
    },

    onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
        const { author, newPrefix, setGlobal } = Reaction;
        if (event.userID !== author) return;
        if (setGlobal) {
            global.GoatBot.config.prefix = newPrefix;
            fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
            return message.reply(getLang("successGlobal", newPrefix));
        } else {
            await threadsData.set(event.threadID, newPrefix, "data.prefix");
            return message.reply(getLang("successThisThread", newPrefix));
        }
    },

    onChat: async function ({ event, message, getLang }) {
        if (event.body && event.body.toLowerCase() === "prefix") {
            // liste des images fixes
            const images = [
                "https://i.imgur.com/xxxx1.jpg",
                "https://i.imgur.com/xxxx2.png",
                "https://i.imgur.com/xxxx3.gif",
                "https://i.imgur.com/xxxx4.jpg",
                "https://i.imgur.com/xxxx5.png"
            ];

            // choisir une image random
            const randImg = images[Math.floor(Math.random() * images.length)];
            let imgStream = [];

            try {
                const res = await axios.get(randImg, { responseType: "stream" });
                imgStream.push(res.data);
            } catch (e) {
                console.error(e);
            }

            return message.reply({
                body: getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)),
                attachment: imgStream
            });
        }
    }
};