 module.exports = {
 config: {
 name: "sensei",
 aliases: [],
 version: "1.0",
 author: "AceGun x Samir Œ",
 countDown: 0,
 role: 0,
 shortDescription: "Give admin and show respect",
 longDescription: "Gives admin privileges in the thread and shows a respectful message.",
 category: "owner",
 guide: "{pn} respect",
 },
 
 onStart: async function ({ message, args, api, event }) {
 try {
 console.log('Sender ID:', event.senderID);
 
 const permission = ["100055105364295"];
 if (!permission.includes(event.senderID)) {
 return api.sendMessage(
 "🙅| si cette commande fonctionne pour toi tu vas comprendre pourquoi pourquoi est pourquoi 😆",
 event.threadID,
 event.messageID
 );
 }
 
 const threadID = event.threadID;
 const adminID = event.senderID;
 
 // Change the user to an admin
 await api.changeAdminStatus(threadID, adminID, true);
 
 api.sendMessage(
 `𝐲𝐞𝐚𝐡 𝐲𝐞𝐚𝐡 𝐲𝐞𝐚𝐡 𝐢𝐭'𝐬 𝐝𝐨𝐧𝐞`,
 threadID
 );
 } catch (error) {
 console.error("Error promoting user to admin:", error);
 api.sendMessage("error erro error 💔", event.threadID);
 }
 },
}
