module.exports = {
    config: {
        name: "count",
        version: "1.4",
        author: "CLEVER Team",
        countDown: 5,
        role: 0,
        description: {
            en: "View message counts of all members or specific users in this group."
        },
        category: "Stats",
        guide: {
            en: "{pn}: your messages\n{pn} @tag: messages of tagged members\n{pn} all: messages of all members"
        }
    },

    langs: {
        en: {
            header: "📚 CLEVER COUNT 📚",
            topMembers: "🌿 Top members",
            page: "📜 Page [%1/%2]",
            reply: '💬 Reply with the page number to see more',
            yourResult: "You are ranked %1 with %2 messages in this group",
            userResult: "%1 rank %2 with %3 messages",
            noMessages: "Those without messages are not listed.",
            invalidPage: "Invalid page number"
        }
    },

    onStart: async function({ args, threadsData, message, event, api, commandName, getLang }) {
        const { threadID, senderID } = event;
        const threadData = await threadsData.get(threadID);
        const members = threadData.members || [];
        const usersInGroup = (await api.getThreadInfo(threadID)).participantIDs;

        // Créer array trié par messages
        let arraySort = [];
        let stt = 1;
        for (const user of members) {
            if (!usersInGroup.includes(user.userID)) continue;
            arraySort.push({
                name: user.name,
                count: user.count || 0,
                uid: user.userID
            });
        }
        arraySort.sort((a, b) => b.count - a.count);
        arraySort = arraySort.map(u => ({ ...u, stt: stt++ }));

        // Cas +count all
        if (args[0] && args[0].toLowerCase() === "all") {
            const perPage = 10;
            const pages = Math.ceil(arraySort.length / perPage);
            let page = 1;
            if (args[1]) page = Math.min(Math.max(parseInt(args[1]), 1), pages);

            let msg = `╔════════════════════╗\n│       📊 CLEVER       │\n╚════════════════════╝\n\n`;
            msg += `${getLang("topMembers")}\n\n`;

            const start = (page - 1) * perPage;
            const end = start + perPage;
            arraySort.slice(start, end).forEach(u => {
                msg += `➤ ${u.stt}/ ${u.name} : ${u.count} messages\n`;
            });

            msg += `\n───────────────\n`;
            msg += `${getLang("page", page, pages)}\n${getLang("reply")}\n`;
            msg += `───────────────\n\n${getLang("noMessages")}`;

            return message.reply(msg, (err, info) => {
                if (err) return message.err(err);
                global.GoatBot.onReply.set(info.messageID, {
                    commandName,
                    page,
                    perPage,
                    arraySort,
                    author: senderID,
                    totalPages: pages
                });
            });
        }

        // Cas utilisateur spécifique ou soi-même
        const findUser = arraySort.find(u => u.uid === senderID);
        return message.reply(getLang("yourResult", findUser.stt, findUser.count));
    },

    onReply: ({ message, event, Reply, getLang }) => {
        const { body, senderID } = event;
        const { author, page, perPage, arraySort, totalPages } = Reply;
        if (senderID !== author) return;

        const nextPage = parseInt(body);
        if (isNaN(nextPage) || nextPage < 1 || nextPage > totalPages)
            return message.reply(getLang("invalidPage"));

        let msg = `╔════════════════════╗\n│       📊 CLEVER       │\n╚════════════════════╝\n\n`;
        msg += `${getLang("topMembers")}\n\n`;

        const start = (nextPage - 1) * perPage;
        const end = start + perPage;
        arraySort.slice(start, end).forEach(u => {
            msg += `➤ ${u.stt}/ ${u.name} : ${u.count} messages\n`;
        });

        msg += `\n───────────────\n`;
        msg += `${getLang("page", nextPage, totalPages)}\n${getLang("reply")}\n`;
        msg += `───────────────\n\n${getLang("noMessages")}`;

        message.reply(msg, (err, info) => {
            if (err) return message.err(err);
            message.unsend(Reply.messageID);
            global.GoatBot.onReply.set(info.messageID, {
                commandName: Reply.commandName,
                page: nextPage,
                perPage,
                arraySort,
                author: senderID,
                totalPages
            });
        });
    },

    onChat: async ({ usersData, threadsData, event }) => {
        const { senderID, threadID } = event;
        const members = await threadsData.get(threadID, "members") || [];
        const findMember = members.find(u => u.userID === senderID);

        if (!findMember) {
            members.push({ userID: senderID, name: await usersData.getName(senderID), count: 1 });
        } else {
            findMember.count = (findMember.count || 0) + 1;
        }

        await threadsData.set(threadID, members, "members");
    }
};