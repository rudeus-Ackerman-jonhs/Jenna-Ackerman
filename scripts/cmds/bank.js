const fs = require("fs");

module.exports = {
  config: {
    name: "bank",
    description: "Déposer ou retirer de l'argent de la banque et gagner des intérêts",
    guide: {
      fr: "Banque:\nIntérêt - Solde - Retirer - Déposer - Transférer - TopRiches - Prêt - PayerPrêt - Loterie - Parier - InvestissementRisqué[hrinvest] - Braquage"
    },
    category: "game",
    countDown: 0,
    role: 0,
    author: "Loufi | JARiF"
  },

  onStart: async function ({ args, message, event, api, usersData }) {
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);

    const userMoney = await usersData.get(event.senderID, "money");
    const user = parseInt(event.senderID);
    const info = await api.getUserInfo(user);
    const username = info[user].name;

    const bankData = JSON.parse(fs.readFileSync("./bank.json", "utf8"));
    if (!bankData[user]) {
      bankData[user] = { bank: 0, lastInterestClaimed: Date.now() };
      fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    }

    const command = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);
    const recipientUID = parseInt(args[2]);

    switch (command) {
      case "deposit":
        const depositPassword = args[1];
        const depositAmount = parseInt(args[2]);

        if (!depositPassword || !depositAmount) {
          return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Veuillez fournir un mot de passe et un montant valide pour déposer.🔑\nExemple: +bank deposit (votre_mdp) (montant)`);
        }

        if (bankData[user].password !== depositPassword) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Mot de passe incorrect.🔑");
        }

        if (isNaN(depositAmount) || depositAmount <= 0) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Veuillez entrer un montant valide.💸");
        }

        if (userMoney < depositAmount) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Vous n'avez pas assez d'argent.✖");
        }

        bankData[user].bank += depositAmount;
        await usersData.set(event.senderID, { money: userMoney - depositAmount });
        fs.writeFileSync("./bank.json", JSON.stringify(bankData));
        return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Vous avez déposé avec succès ${depositAmount}$ sur votre compte.`);

      case "withdraw":
        const withdrawPassword = args[1];
        const withdrawAmount = parseInt(args[2]);

        if (!withdrawPassword || !withdrawAmount) {
          return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Veuillez fournir un mot de passe et un montant valide pour retirer.🔑\nExemple: +bank withdraw (votre_mdp) (montant)`);
        }

        if (bankData[user].password !== withdrawPassword) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Mot de passe incorrect.🔑");
        }

        const balance = bankData[user].bank || 0;

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Veuillez entrer un montant valide.💸");
        }

        if (withdrawAmount > balance) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Le montant demandé est supérieur à votre solde.👽");
        }

        bankData[user].bank = balance - withdrawAmount;
        await usersData.set(event.senderID, { money: userMoney + withdrawAmount });
        fs.writeFileSync("./bank.json", JSON.stringify(bankData));
        return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Vous avez retiré avec succès ${withdrawAmount}$ de votre compte.`);

      case "transfer":
        const senderBalance = bankData[user].bank || 0;
        if (isNaN(amount) || amount <= 0) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Veuillez entrer un montant valide à transférer.");
        }
        if (senderBalance < amount) {
          return message.reply("==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Vous n'avez pas assez d'argent pour ce transfert.");
        }
        if (isNaN(recipientUID)) {
          return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Veuillez indiquer l'UID du destinataire.`);
        }

        if (!bankData[recipientUID]) {
          bankData[recipientUID] = { bank: 0, lastInterestClaimed: Date.now() };
        }

        bankData[user].bank -= amount;
        bankData[recipientUID].bank += amount;
        fs.writeFileSync("./bank.json", JSON.stringify(bankData));

        const recipientName = (await usersData.getName(recipientUID)) || "Inconnu";
        await api.sendMessage(
          `==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Vous avez reçu ${amount}$ de ${username} !\n✧Votre nouveau solde: ${bankData[recipientUID].bank}$`,
          recipientUID
        );

        return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Vous avez envoyé ${amount}$ à ${recipientName} avec succès.`);

      case "show":
        const bankBalance = bankData[user].bank || 0;
        return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n✧Votre solde bancaire: ${bankBalance}$\n✧Pour retirer de l'argent: ${p}bank withdraw 'montant'\n✧Pour déposer: ${p}bank deposit 'montant'`);

      default:
        return message.reply(`==[📚CLEVER BANK 📚]==\n━━━━━━━━━━━━━━━━\n📲| Veuillez utiliser une des commandes suivantes:\n✰ ${p}bank deposit\n✰ ${p}bank withdraw\n✰ ${p}bank show\n✰ ${p}bank transfer\n✰ ${p}bank interest\n✰ ${p}bank top\n✰ ${p}bank loan\n✰ ${p}bank payloan\n✰ ${p}bank hrinvest\n✰ ${p}bank gamble\n✰ ${p}bank heist\n━━━━━━━━━━━━━━━━\n✧Assurez-vous d'ajouter un mot de passe pour sécuriser votre compte: ${p}bank setpassword`);
    }
  }
};