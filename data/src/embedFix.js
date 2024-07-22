const Client = require('./discordClient');
const Discord = require('discord.js');

Client.on(Discord.Events.MessageCreate, message => {
  if (message.author.bot) return;

  if (hasMatchingDomain(message.content)) {
    const url = replaceDomains(extractURL(message.content));
    message.suppressEmbeds(true);
    message.reply(url);
  }
});

const domainArray = [
  { domain: 'twitter.com', replacement: 'fxtwitter.com' },
  { domain: 'x.com', replacement: 'fixupx.com' },
  { domain: 'tiktok.com', replacement: 'd.tnktok.com' },
  { domain: 'vm.tiktok.com', replacement: 'd.tnktok.com' },
  { domain: 'reddit.com', replacement: 'rxddit.com' },
  { domain: 'old.reddit.com', replacement: 'old.rxddit.com' },
  { domain: 'instagram.com', replacement: 'ddinstagram.com' }
];

function extractURL(input) {
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = input.match(urlRegex);
  return match ? match[0] : null;
}

function replaceDomains(input) {
  input = input.replace(/www\./g, '');

  const domainRegex = /(?:https?:\/\/)?((?:\w+\.)+\w+)\//i;
  const match = input.match(domainRegex);

  if (!match) return input;

  const domain = match[1];
  const replacementEntry = domainArray.find(entry => entry.domain === domain);

  if (!replacementEntry) return input;

  const replacement = replacementEntry.replacement;
  const replacedUrl = input.replace(new RegExp(domain.replace('.', '\\.') + '\\b', 'i'), replacement);

  return replacedUrl.replace(/^(https?:\/\/)/, 'https://');
}

function hasMatchingDomain(input) {
  const domainRegex = /(?:https?:\/\/)?(?:www\.)?((?:\w+\.)+\w+)\//i;
  const match = input.match(domainRegex);

  if (!match) return false;

  const domain = match[1];
  return domainArray.some(entry => entry.domain === domain);
}
