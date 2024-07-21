const { YoutubeExtractor, SpotifyExtractor, SoundCloudExtractor, AttachmentExtractor  } = require('@discord-player/extractor');
const { getMessage, getGuildLang } = require('./locales');
const { Player } = require('discord-player');
const Client = require('./discordClient');
const Discord = require('discord.js');

const player = new Player(Client);
player.extractors.register(YoutubeExtractor, {});
player.extractors.register(SpotifyExtractor, {});
player.extractors.register(SoundCloudExtractor, {});
player.extractors.register(AttachmentExtractor, {});

player.events.on('playerError', (error) => {
  console.log(getMessage('console.musicplayer.playerror', getGuildLang(interaction.guild.id), { error }))
});

Client.on(Discord.Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  const { commandName, options } = interaction;
  
  switch (commandName) {
    case 'play':
    const query = options.getString('song');
    await playSong(interaction, query);
    break;
    case 'skip':
    await skipSong(interaction);
    break;
    case 'stop':
    await stopSong(interaction);
    break;
    case 'wrongsong':
    await undoSong(interaction);
    break;
    case 'listqueue':
    await listQueue(interaction);
    break;
    case 'song':
    await currentSong(interaction);
    break;
    default:
    break;
  }
});

async function playSong(interaction, query) {
  const channel = interaction.member.voice.channel;
  
  // return if user is not in a voice channel
  if (!channel) return await interaction.reply({ content: getMessage('user.musicplayer.missing.voicechat', getGuildLang(interaction.guild.id)), ephemeral: true });
  
  // defer reply early to avoid message timeout while searching
  await interaction.deferReply({ ephemeral: true });
  
  try {
    const searchResults = await player.search(query, { requestedBy: interaction.member });
    
    // return if no result was found
    if (searchResults.tracks.length === 0) {
      return await interaction.editReply({ content: getMessage('user.musicplayer.missing.result', getGuildLang(interaction.guild.id)), ephemeral: true });
    }
    
    // queue first song in search result
    const track = searchResults.tracks[0];
    await player.play(channel, track, { requestedBy: interaction.member });
    player.nodes.get(interaction.guild).node.setVolume(3);
    
    if (searchResults.playlist) return interaction.editReply({
      content: getMessage('user.musicplayer.playlist.queued', getGuildLang(interaction.guild.id), { title: track.title, url: track.url, count: searchResults.playlist.tracks.length }),
      ephemeral: true
    });
    
    interaction.editReply({
      content: getMessage('user.musicplayer.song.queued', getGuildLang(interaction.guild.id), { title: track.title, url: track.url }),
      ephemeral: true
    });
  } catch (error) {
    console.error(getMessage('console.musicplayer.playerror', getGuildLang(interaction.guild.id), { error }));
    interaction.editReply({ content: getMessage('user.musicplayer.playerror', getGuildLang(interaction.guild.id)), ephemeral: true });
  }
}

async function stopSong(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const queue = player.nodes.get(interaction.guild);
  
  if (!queue) return interaction.editReply({ content: getMessage('user.musicplayer.not.playing', getGuildLang(interaction.guild.id)), ephemeral: true });
  queue.delete();
  
  // respond with randomized goodbye message
  const messageVariations = getMessage('user.musicplayer.goodbye', getGuildLang(interaction.guild.id)).split('|');
  const selectedMessage = messageVariations[Math.floor(Math.random() * messageVariations.length)];
  interaction.editReply({ content: selectedMessage, ephemeral: true });
}

async function skipSong(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const queue = player.nodes.get(interaction.guild);
  
  if (!queue) return interaction.editReply({ content: getMessage('user.musicplayer.not.playing', getGuildLang(interaction.guild.id)), ephemeral: true });
  queue.node.skip();
  
  interaction.editReply({ content: getMessage('user.musicplayer.skip', getGuildLang(interaction.guild.id)), ephemeral: true });
}

async function undoSong(interaction) {
  await interaction.deferReply({ ephemeral: true });
  
  // skip if there is nothing playing
  const queue = player.nodes.get(interaction.guild);
  if (!queue) return interaction.editReply({ content: getMessage('user.musicplayer.not.playing', getGuildLang(interaction.guild.id)), ephemeral: true });
  
  // remove track if found in queue
  const result = queue.tracks.data.find(track => track.requestedBy.id === interaction.member.id);
  if (!result) return interaction.editReply({ content: getMessage('user.musicplayer.missing.undo', getGuildLang(interaction.guild.id)), ephemeral: true });
  
  // let the user know nothing was recetly requested
  queue.removeTrack(result);
  interaction.editReply({ content: getMessage('user.musicplayer.undo', getGuildLang(interaction.guild.id)), ephemeral: true });
}

async function currentSong(interaction) {
  await interaction.deferReply({ephemeral: true});
  const node = player.nodes.get(interaction.guild);
  
  // return if there is nothing playing
  if (!node) return interaction.editReply({
    content: getMessage('user.musicplayer.not.playing', getGuildLang(interaction.guild.id)),
    ephemeral: true
  });
  
  const title = node.currentTrack.title;
  const url = node.currentTrack.url;
  const user = node.currentTrack.requestedBy.displayName;
  interaction.editReply({ content: getMessage('user.musicplayer.song.info', getGuildLang(interaction.guild.id), { title, url, user }), ephemeral: true });
}

async function listQueue(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const node = player.nodes.get(interaction.guild);
  
  // return if there is nothing playing
  if (!node) return interaction.editReply({
    content: getMessage('user.musicplayer.not.playing', getGuildLang(interaction.guild.id)),
    ephemeral: true
  });
  
  // return if queue is empty
  if (!node.tracks.data.length) return interaction.editReply({
    content: getMessage('user.musicplayer.queue.empty', getGuildLang(interaction.guild.id)),
    ephemeral: true
  });
  
  // limit total characters to avoid 2000 char message limit
  const MAX_CHARACTERS = 1800;
  let displayedQueueList = [];
  let totalChars = 0;
  
  // map queue entries and calculate total characters
  const queueList = node.tracks.data.map(track => {
    const message = getMessage('user.musicplayer.queue.info.bullet', getGuildLang(interaction.guild.id), {title: track.title, url: track.url, user: track.requestedBy.displayName});
    totalChars += message.length;
    return message;
  });
  
  // only trim queue list if needed
  if (totalChars <= MAX_CHARACTERS) {
    displayedQueueList = queueList;
  } else {
    let currentChars = 0;
    displayedQueueList = [];

    for (const track of queueList) {
      currentChars += track.length;
      if (currentChars > MAX_CHARACTERS) break;
      displayedQueueList.push(track);
    }

    displayedQueueList.push(getMessage('user.musicplayer.queue.info.limit', getGuildLang(interaction.guild.id), { count: queueList.length - displayedQueueList.length }));
  }
  
  interaction.editReply({
    content: getMessage('user.musicplayer.queue.info', getGuildLang(interaction.guild.id), { queue: displayedQueueList.join('\n')}), 
    ephemeral: true
  });
}
