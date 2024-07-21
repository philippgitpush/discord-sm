> [!NOTE]  
> Please note that this bot is not actively maintained. Some services, especially those related to embed fixes, may occasionally go down.

# Discord-SM

This is a Node.js-based Discord bot that plays music from various sources including Spotify, YouTube, and SoundCloud. It also includes features for managing the music queue, supports multiple commands, and handles social media link embeds.

## Features

- **Music Playback**: Add, skip, stop, and manage songs in the queue from various sources.
- **Social Media Link Embeds**: Automatically replaces original embeds for social media links with custom embed fixes.
- **Multilanguage Support**: The bot can operate in multiple languages. Currently available languages are English and German.

## Docker Setup

This bot runs in a Docker container. To set up and run the bot using Docker, follow these steps:

### Prerequisites

Ensure you have Docker installed on your system.

### Installation

1. **Clone this repository**.

2. **Navigate to the project directory** where the Dockerfile and `compose.yml` are located.

3. **Build and start the Docker container** using Docker Compose:
   ```sh
   docker compose up --build
   ```

   This command will:
   - Build the Docker image as defined in the `Dockerfile`.
   - Start the container with the configuration specified in `compose.yml`.

### Configuration

Before running the Docker container, make sure you set up the necessary environment variables. Create a `.env` file in the `data` directory with the following content:

```sh
DISCORD_TOKEN=<discord-token>
CLIENT_ID=<bot-client-id>
```

Replace `<discord-token>` and `<bot-client-id>` with your actual Discord bot token and client ID.

## Commands

Here's an overview of the available commands:

### Slash Commands

| Command      | Description                                                                 | Options                               |
|--------------|-----------------------------------------------------------------------------|---------------------------------------|
| `/play`      | Add a song from Spotify, YouTube, SoundCloud, or similar to the queue.      | `song`: Song title or link (required) |
| `/stop`      | Clear the queue and kick the bot from the channel.                          |                                       |
| `/skip`      | Skip the current song in the queue.                                         |                                       |
| `/listqueue` | Display a list of the current queue.                                        |                                       |
| `/wrongsong` | Remove the last song requested by you from the queue.                       |                                       |
| `/song`      | Display the current song.                                                   |                                       |
| `/language`  | Set the bot's language for the entire server.                               | `lang`: Language choice (required)    |

### Text Commands

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| `!forcedelete` | Deletes all guild-specific commands for the bot. |
| `!forceupdate` | Updates all guild-specific commands for the bot. |

## Localization

The bot supports multiple languages. Currently available languages are English and German. You can change the bot's language using the `/language` command.

## License

This project is licensed under the MIT License.
