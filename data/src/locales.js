const messages = require('../config/messages.json');
const Client = require('./discordClient');
const Discord = require('discord.js');
const fs = require('fs');

Client.on(Discord.Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;
  
  switch (commandName) {
    case 'language':
        const lang = options.getString('lang');
        await setGuildLang(interaction, lang);
        break;
    default:
        break;
  }
});

function getMessage(key, language = 'en', replacements) {
  // use english as default when anything localized is missing
  let message = (messages[language] && messages[language][key]) || messages['en'][key] || '';


  if (replacements) {   // variable replacement
      for (const [placeholder, value] of Object.entries(replacements)) {
          message = message.replace(new RegExp(`%${placeholder}`, 'g'), value);
      }
  }

  return message;
}

function getGuildLang(guildId) {
  const guildDataPath = './config/guild_data.json';
  const guildData = JSON.parse(fs.readFileSync(guildDataPath, 'utf8'));
  return guildData[guildId] ? guildData[guildId].language : 'en';
}

async function setGuildLang(interaction, lang) {
  await interaction.deferReply({ ephemeral: true });

  const guildDataPath = './config/guild_data.json';
  const guildData = JSON.parse(fs.readFileSync(guildDataPath, 'utf8'));

  guildData[interaction.guildId] = {
      language: lang
  };

  fs.writeFileSync(guildDataPath, JSON.stringify(guildData, null, 2));

  interaction.editReply({ content: getMessage('user.locale.changed', getGuildLang(interaction.guild.id)), ephemeral: true });
}

module.exports = {
  getGuildLang,
  getMessage
};
