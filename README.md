> [!NOTE]  
> Please note that this bot is not actively maintained.

# Discord Embed Buddy

This is a Node.js-based Discord bot that intercepts messages with potentially faulty social media embeds and provides proxy links for the content in response.

## URL Replacements

Here's an overview of the URL replacements:

| Original URL       | Replacement URL  |
|--------------------|------------------|
| `twitter.com`      | `fxtwitter.com`  |
| `x.com`            | `fixupx.com`     |
| `tiktok.com`       | `d.tnktok.com`   |
| `vm.tiktok.com`    | `d.tnktok.com`   |
| `reddit.com`       | `rxddit.com`     |
| `old.reddit.com`   | `old.rxddit.com` |
| `instagram.com`    | `ddinstagram.com`|

## Docker Setup

This bot runs in a Docker container. To set up and run the bot using Docker, follow these steps:

### Prerequisites

Ensure you have Docker installed on your system.

### Installation

1. **Clone this repository**.

1. **Configure your `.env` file**.

   Before running the Docker container, make sure you set up the necessary environment variables. Create a `.env` file in the `data` directory with the following content:

   ```sh
   DISCORD_TOKEN=<discord-token>
   CLIENT_ID=<bot-client-id>
   ```

   Replace `<discord-token>` and `<bot-client-id>` with your actual Discord bot token and client ID.

2. **Navigate to the project directory** where the Dockerfile and `compose.yml` are located.

3. **Build and start the Docker container** using Docker Compose:
   ```sh
   docker compose up --build
   ```

   This command will:
   - Build the Docker image as defined in the `Dockerfile`.
   - Start the container with the configuration specified in `compose.yml`.

## License

This project is licensed under the MIT License.
