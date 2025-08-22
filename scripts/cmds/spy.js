const axios = require("axios");

const baseApiUrl = async () => {
 const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
 return base.data.api;
};

module.exports = {
 config: {
  name: "spy",
  aliases: ["whoishe", "whoisshe", "whoami", "atake"],
  version: "2.2",
  author: "Rudeus Ackerman (modifié du code de Chitron Bhattacharjee)",
  role: 0,
  countDown: 10,
  description: "Get user information and a styled banner",
  category: "information"
 },

 onStart: async function ({ event, message, usersData, api, args }) {
  const uidSelf = event.senderID;
  const uidMentioned = Object.keys(event.mentions)[0];
  let uid;

  if (args[0]) {
   if (/^\d+$/.test(args[0])) {
    uid = args[0];
   } else {
    const match = args[0].match(/profile\.php\?id=(\d+)/);
    if (match) uid = match[1];
   }
  }

  if (!uid)
   uid = event.type === "message_reply"
    ? event.messageReply.senderID
    : uidMentioned || uidSelf;

  const userInfo = await api.getUserInfo(uid);
  const avatarUrl = await usersData.getAvatarUrl(uid);
  const user = userInfo[uid];

  const nickname = (await usersData.get(uid))?.nickName || user.alternateName || "𝙽𝚘𝚗𝚎";
  const username = user.vanity || "𝙽𝚘𝚗𝚎";
  const profileUrl = user.profileUrl || "𝙿𝚛𝚒𝚟𝚊𝚝𝚎";
  const birthday = user.isBirthday !== false ? user.isBirthday : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎";
  const gender = user.gender === 1 ? "👧 Girl" : user.gender === 2 ? "👦 Boy" : "🌀 Undefined";
  const isFriend = user.isFriend ? "✅ Yes" : "❌ No";
  const position = user.type?.toUpperCase() || "Normal User";

  const allUser = await usersData.getAll();
  const userData = await usersData.get(uid);
  const money = userData.money || 0;
  const exp = userData.exp || 0;

  const rank = allUser.slice().sort((a, b) => b.exp - a.exp)
   .findIndex(u => u.userID === uid) + 1;

  const moneyRank = allUser.slice().sort((a, b) => b.money - a.money)
   .findIndex(u => u.userID === uid) + 1;

  // Baby teach system
  let babyTeach = 0;
  try {
   const res = await axios.get(`${await baseApiUrl()}/baby?list=all`);
   const babyList = res.data?.teacher?.teacherList || [];
   babyTeach = babyList.find(t => t[uid])?.[uid] || 0;
  } catch { }

  // Nouveau style cadré
  const info = `
⫷=================⫸
      👤 USER PROFILE 👤
⫷=================⫸
👤 Name       : ${user.name}
🆔 UID        : ${uid}
⚧ Gender     : ${gender}
🧭 Role       : ${position}
🔗 Username   : ${username}
🌐 Profile    : ${profileUrl}
🎂 Birthday   : ${birthday}
🤝 FriendBot : ${isFriend}

⫷=================⫸
         ⚡ STATS ⚡
⫷=================⫸
💰 Money      : $${formatMoney(money)}
📈 Rank       : #${rank}/${allUser.length}
💸 MoneyRank  : #${moneyRank}/${allUser.length}
👶 BabyTeach  : ${babyTeach}

⫷=================⫸
 ✨ Bot by RUDEUS ACKERMAN ✨
⫷=================⫸`.trim();

  // Generate banner via Popcat API
  const bannerUrl = `https://api.popcat.xyz/welcomecard` +
   `?username=${encodeURIComponent(user.name)}` +
   `&discriminator=${uid.slice(-4)}` +
   `&avatar=${encodeURIComponent(avatarUrl)}` +
   `&background=${encodeURIComponent("https://shipu.c0m.in/banner.png")}` +
   `&color=${randomColor()}` +
   `&text1=${encodeURIComponent(user.name)}` +
   `&text2=${encodeURIComponent("API Owner—")}` +
   `&text3=${encodeURIComponent("Rudeus Ackerman")}`;

  return message.reply({
   body: info,
   attachment: await global.utils.getStreamFromURL(bannerUrl)
  });
 }
};

// Format large numbers with suffix
function formatMoney(num) {
 const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N"];
 let unit = 0;
 while (num >= 1000 && ++unit < units.length) num /= 1000;
 return num.toFixed(1).replace(/\.0$/, "") + units[unit];
}

// Random color for banner
function randomColor() {
 const colors = ["red", "blue", "purple", "green", "yellow", "pink", "orange", "aqua"];
 return colors[Math.floor(Math.random() * colors.length)];
}