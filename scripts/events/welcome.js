const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			welcomeMessage: "𝑚𝑒𝑟𝑐𝑖 𝑑𝑒 𝑚'𝑖𝑛𝑣𝑖𝑡𝑒𝑟 𝑎𝑢 𝑔𝑟𝑜𝑢𝑝𝑒🍀 {boxName}\n─────⊱◈☘️◈⊰─────\n𝑝𝑟𝑒𝑓𝑖𝑥: 〖%1〗\n─────⊱◈☘️◈⊰─────\n𝑢𝑡𝑖𝑙𝑖𝑠𝑒𝑧 %1help 𝑝𝑜𝑢𝑟 𝑣𝑜𝑖𝑟 𝑚𝑎 𝑙𝑖𝑠𝑡𝑒 𝑑𝑒𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑒𝑠",
			multiple1: "you",
			multiple2: "you guys",
			defaultWelcomeMessage: `𝗦𝗔𝗟𝗨𝗧 ➔{userName}➔\n𝙂𝙍𝙊𝙐𝙋:{boxName}\n══━━━━✥🍂✥━━━━══\n 𝚝𝚊𝚌𝚑𝚎𝚜 𝚍𝚎 𝚋𝚒𝚎𝚗 𝚝'𝚊𝚝𝚝𝚎𝚗𝚍𝚛𝚎 𝚊𝚟𝚎𝚌 𝚕𝚎𝚜 𝚊𝚞𝚝𝚛𝚎𝚜 𝚎𝚝 𝚛𝚎𝚜𝚙𝚎𝚌𝚝𝚎𝚋𝚕𝚎𝚜 𝚛𝚎𝚐𝚕𝚎𝚜 𝚍𝚞 𝚐𝚛𝚘𝚞𝚙𝚎 🍀\n 𝚎𝚝 𝚜𝚞𝚛𝚝𝚘𝚞𝚝 𝚋𝚒𝚎𝚗𝚟𝚎𝚗𝚞𝚎 ☺️`
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
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// push new member to array
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// if timeout is set, clear it
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// set new timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
