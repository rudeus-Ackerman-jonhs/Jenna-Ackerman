📄 | Source code of "naruto-storm.js":

const characters = [
  {
    name: "Naruto Uzumaki",
    power: 50,
    basic: "Rasengan 🌀",
    ultimate: "Multi-Clones + Rasengan Géant 🌪️"
  },
  {
    name: "Naruto (Mode Ermite)",
    power: 60,
    basic: "Rasengan Géant 🌪️",
    ultimate: "Futon Rasenshuriken 🌪️💨"
  },
  {
    name: "Naruto (Rikudo)",
    power: 70,
    basic: "Orbe Truth Seeker ⚫",
    ultimate: "Bijuu Mode Rasenshuriken 🦊🌪️"
  },
  {
    name: "Naruto (Baryon Mode)",
    power: 85,
    basic: "Punch Ultra Rapide ⚡",
    ultimate: "Explosion Chakra Nucléaire ☢️"
  },
  {
    name: "Sasuke Uchiha",
    power: 60,
    basic: "Chidori ⚡",
    ultimate: "Kirin ⚡🌩️"
  },
  {
    name: "Sasuke (Taka)",
    power: 65,
    basic: "Chidori Nagashi ⚡💧",
    ultimate: "Susano'o 💀"
  },
  {
    name: "Sasuke (Rinnegan)",
    power: 70,
    basic: "Amaterasu 🔥",
    ultimate: "Indra's Arrow ⚡🏹"
  },
  {
    name: "Kakashi Hatake",
    power: 60,
    basic: "Raikiri ⚡",
    ultimate: "Kamui 🌀"
  },
  {
    name: "Kakashi (DMS)",
    power: 75,
    basic: "Kamui Raikiri ⚡🌀",
    ultimate: "Susano'o Parfait 💠"
  },
  {
    name: "Minato Namikaze",
    power: 80,
    basic: "Hiraishin Rasengan ⚡🌀",
    ultimate: "Mode Kyuubi 🦊"
  },
  {
    name: "Hashirama Senju",
    power: 70,
    basic: "Foret Naissante 🌳",
    ultimate: "Art Senin 🌿"
  },
  {
    name: "Tobirama Senju",
    power: 60,
    basic: "Suiton: Dragon 🌊",
    ultimate: "Edo Tensei ⚰️"
  },
  {
    name: "Tsunade",
    power: 60,
    basic: "Coup Surprenant 💥",
    ultimate: "Sceau Byakugō 💎"
  },
  {
    name: "Hiruzen Sarutobi",
    power: 65,
    basic: "5 Éléments 🌍🔥💧🌪️⚡",
    ultimate: "Shinigami Seal ☠️"
  },
  {
    name: "Pain (Tendo)",
    power: 68,
    basic: "Shinra Tensei ⬇️",
    ultimate: "Chibaku Tensei ⬆️"
  },
  {
    name: "Konan",
    power: 55,
    basic: "Danse de Papier 📄",
    ultimate: "Mer de Papiers Explosifs 💥📄"
  },
  {
    name: "Nagato",
    power: 68,
    basic: "Absorption Chakra 🌀",
    ultimate: "Réanimation Universelle ⚰️"
  },
  {
    name: "Deidara",
    power: 60,
    basic: "Argile Explosive C2 💣",
    ultimate: "Auto-Destruction C0 💥"
  },
  {
    name: "Kakuzu",
    power: 60,
    basic: "Futon - Zankokuhaha 💨",
    ultimate: "Cœurs Enchaînés 💔"
  },
  {
    name: "Hidan",
    power: 50,
    basic: "Attaque Rituelle ⛧",
    ultimate: "Rituel Jashin ⛧"
  },
  {
    name: "Sasori",
    power: 58,
    basic: "Marionnettes 🎭",
    ultimate: "Armée des 100 🎭"
  },
  {
    name: "Itachi Uchiha",
    power: 70,
    basic: "Tsukuyomi 🌙",
    ultimate: "Amaterasu + Susano'o 🔥💀"
  },
  {
    name: "Kisame Hoshigaki",
    power: 62,
    basic: "Requin Géant 🦈",
    ultimate: "Fusion avec Samehada 🦈"
  },
  {
    name: "Orochimaru",
    power: 65,
    basic: "Poignée du Serpent Spectral 🐍",
    ultimate: "Mode Sage Blanc 🐍"
  },
  {
    name: "Asuma Sarutobi",
    power: 55,
    basic: "Lames de Chakra 🔪",
    ultimate: "Furie Mode 💨"
  },
  {
    name: "Maito Gai",
    power: 70,
    basic: "Feu de la Jeunesse 🔥",
    ultimate: "8ème Porte - Nuit de la Mort 💀"
  },
  {
    name: "Kurenai Yuhi",
    power: 45,
    basic: "Genjutsu 🌸",
    ultimate: "Piège Floral 🌸"
  },
  {
    name: "Gaara",
    power: 68,
    basic: "Sable Mouvant 🏜️",
    ultimate: "Armure + Sable Funéraire ⚔️🏜️"
  },
  {
    name: "Temari",
    power: 58,
    basic: "Vent Tranchant 🌪️",
    ultimate: "Danse de la Faucheuse 🌪️"
  },
  {
    name: "Kankuro",
    power: 56,
    basic: "Poupée Karasu 🎭",
    ultimate: "Piège des 3 Marionnettes 🎭"
  },
  {
    name: "Hinata Hyuga",
    power: 52,
    basic: "Paume du Hakkē ✋",
    ultimate: "Protection des 64 Coups ✋✋"
  },
  {
    name: "Neji Hyuga",
    power: 60,
    basic: "Tourbillon Divin 🌪️",
    ultimate: "64 Points du Hakkē ✋"
  },
  {
    name: "Rock Lee",
    power: 65,
    basic: "Lotus Recto 🌸",
    ultimate: "6ème Porte - Paon du Midi 🦚"
  },
  {
    name: "Shikamaru Nara",
    power: 60,
    basic: "Ombre Manipulatrice 🕳️",
    ultimate: "Piège Stratégique Total 🕳️"
  },
  {
    name: "Sakura Haruno",
    power: 60,
    basic: "Coup Supersonique 💥",
    ultimate: "Sceau Byakugō Déchaîné 💎"
  },
  {
    name: "Madara Uchiha",
    power: 75,
    basic: "Susano'o 💀",
    ultimate: "Limbo + Météores ☄️"
  },
  {
    name: "Madara (Rikudo)",
    power: 85,
    basic: "Truth Seeker Orbs ⚫",
    ultimate: "Infinite Tsukuyomi 🌙"
  },
  {
    name: "Obito Uchiha",
    power: 70,
    basic: "Kamui 🌀",
    ultimate: "Jūbi Mode 🔥"
  },
  {
    name: "Obito (Rikudo)",
    power: 80,
    basic: "Gunbai Uchiwa 🌀",
    ultimate: "Shinra Tensei ⬇️"
  },
  {
    name: "Zetsu",
    power: 40,
    basic: "Attaque Furtive 🥷",
    ultimate: "Infection de Corps 🦠"
  },
  {
    name: "Kaguya Otsutsuki",
    power: 78,
    basic: "Portail Dimensionnel 🌀",
    ultimate: "Os Cendré + Expansion Divine ☄️"
  },
  {
    name: "Ay (Raikage)",
    p
