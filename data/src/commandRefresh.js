const { REST, Routes } = require('discord.js');
const { getMessage } = require('./locales');
const Client = require('./discordClient');
const Discord = require('discord.js');

Client.on(Discord.Events.MessageCreate, async message => {
  if (message.author.bot) return;

  switch (message.content) {
    case "!forcedelete":
      await forceDelete(message.member.guild.id);
      break;
    case "!forceupdate":
      await forceUpdate(message.member.guild.id);
      break;
    default:
      break;
  }
});

const commands = [
  {
    name: 'play',
    description: getMessage('user.command.play.desc'),
    description_localizations: {
      de: getMessage('user.command.play.desc', 'de')
    },
    options: [
      {
        name: 'song',
        type: 3,
        description: getMessage('user.command.play.song.desc'),
        description_localizations: {
          de: getMessage('user.command.play.song.desc', 'de')
        },
        required: true
      }
    ]
  },
  {
    name: 'stop',
    description: getMessage('user.command.stop.desc'),
    description_localizations: {
      de: getMessage('user.command.stop.desc', 'de')
    }
  },
  {
    name: 'skip',
    description: getMessage('user.command.skip.desc'),
    description_localizations: {
      de: getMessage('user.command.skip.desc', 'de')
    }
  },
  {
    name: 'listqueue',
    description: getMessage('user.command.listqueue.desc'),
    description_localizations: {
      de: getMessage('user.command.listqueue.desc', 'de')
    }
  },
  {
    name: 'wrongsong',
    description: getMessage('user.command.wrongsong.desc'),
    description_localizations: {
      de: getMessage('user.command.wrongsong.desc', 'de')
    }
  },
  {
    name: 'song',
    description: getMessage('user.command.song.desc'),
    description_localizations: {
      de: getMessage('user.command.song.desc', 'de')
    }
  },
  {
    name: 'language',
    description: getMessage('user.command.language.desc'),
    description_localizations: {
      de: getMessage('user.command.language.desc', 'de')
    },
    options: [
      {
        name: 'lang',
        type: 3,
        choices: [
          {
            name: getMessage('user.command.language.lang.en'),
            name_localizations: {
              de: getMessage('user.command.language.lang.en', 'de')
            },
            value: 'en'
          },
          {
            name: getMessage('user.command.language.lang.de'),
            name_localizations: {
              de: getMessage('user.command.language.lang.de', 'de')
            },
            value: 'de'
          },
        ],
        description: getMessage('user.command.language.lang.desc'),
        description_localizations: {
          de: getMessage('user.command.language.lang.desc', 'de')
        },
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(getMessage('console.commandrefresh.application.refresh.start'));

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), { body: commands },
        );

        console.log(getMessage('console.commandrefresh.application.refresh.finish'));
    } catch (error) {
        console.error(error);
    }
})();

async function forceUpdate(guild_id) {
  try {
    console.log(getMessage('console.commandrefresh.application.refresh.guild.start'));

    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id), { body: commands },
    );

    console.log(getMessage('console.commandrefresh.application.refresh.guild.finish'));
  } catch (error) {
    console.error(error);
  }
}

async function forceDelete(guild_id) {
  try {
    console.log(getMessage('console.commandrefresh.application.deletion.guild.start'));

    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id), { body: [] },
    );

    console.log(getMessage('console.commandrefresh.application.deletion.guild.finish'));
  } catch (error) {
    console.error(error);
  }
}
