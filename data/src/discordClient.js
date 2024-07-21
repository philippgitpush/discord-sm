const Discord = require('discord.js');

const Client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers ,
  Discord.GatewayIntentBits.GuildVoiceStates
] });

const token = process.env.DISCORD_TOKEN;

Client.once(Discord.Events.ClientReady, readyClient => {
  const tag = readyClient.user.tag;
  console.log('Ready! Logged in as ' + tag);
});

Client.login(token);

module.exports = Client
