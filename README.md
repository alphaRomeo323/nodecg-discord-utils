# Nodecg-Discord-Utils

[![Release](https://img.shields.io/github/v/release/alphaRomeo323/nodecg-discord-utils?label=Release)](https://github.com/alphaRomeo323/nodecg-discord-utils/releases)
![License](https://img.shields.io/github/license/alphaRomeo323/nodecg-discord-utils?label=License)

## TL:DR

This NodeCG-bundle allows you to stream your voice channel and text channel in real time! You can stream to use included discord.js bot and also from an external bot (written with python, go, etc) via API.

## Requirements

- [NodeCG](https://www.nodecg.dev/)

## Installation

In your terminal, please navigate to your root NodeCG folder. Then execute the command `nodecg install alphaRomeo323/nodecg-discord-utils`.

Once completed, execute `nodecg defaultconfig nodecg-discord-utils` to generate the config file. Your config file is located in the `cfg` folder in your NodeCG installation.

If you use external bot, please start NodeCG. This bundle will run in API mode.

In case of included discord.js bot, open nodecg-discord-overlay.json, you'll see something like this.
```json
{
  "botToken": "<bot_token>",
  "prefix": "^",
  "guilds": [
    {
      "id": "<guild_id>",
      "roles": [
        "<role_id>",
      ],
      "streamBots": false
    }
  ]
}
```

- `botToken`: Put your Discord Bot token here. **Do not share this token with anyone**
- `prefix`: Put command prefix here. You use it to control the bot in Discord.
- `guilds`: if you use this bot in two or more servers, please add new field like this.
  ```json
  "guilds": [
    {
      "id": "<guild_id_1>",
      "roles": [
        "<role_id_1>",
      ],
      "logbot": false
    },
    {
      "id": "<guild_id_2>",
      "roles": [
        "<role_id_2>",
        "<role_id_3>"
      ],
      "logbot": true
    }
  ]

- `id`: Put your server ID here. it is the first snowflake in the copied message URL.  
  ![server_id](https://cdn.discordapp.com/attachments/636576061932699650/1063438885742444644/image.png)
- `roles`: When members who isn't bot owner use it, put role ID that allows control the bot here. if you want to know role IDs, check the Develovper mode and right click on role icon.  
  ![copy_role_id](https://cdn.discordapp.com/attachments/636576061932699650/1063439477441298483/image.png)
- `streamBots`: If you want to stream other bot's message, please rewrite to `true`.

Finally type `nodecg start` in your root NodeCG folder to start your bot.


## Bot Usage

You can see bot commands with `help`.

`ping` is the command to check bot operation.

When you send `chatstream start` command, the bundle start streaming chat log in a channel the command sended. However the message starts with `prefix` (default `^`) isn't be streamed. `chatstream stop` command stops overlay.


When you start voice channel stream, send `voicestream start` command. the bot join your VC channel and start overlay. To close the overlay, please send `voicestream stop` command. If there is no member in the voice channel, overlay automatically stops. **Don't move the bot into another voice channel once connected, it might cause the overlay to glitch. Instead, disconnect the bot, move to the new voice channel, then connect the bot again.**

Currently, it can't stream sounds of voice channel. If you need the function, please use other way.

## API Reference

See [API Reference Page](api_reference/README.md)

## Starts

this bundle was inspired by [nicnacnic/nodecg-discord-overlay](https://github.com/nicnacnic/nodecg-discord-overlay). This bundle didn't work in begining in 2023. At first, I wanted to fix it to support current specification of Discord API and discord.js v14. However, I didn't know how to fix because I had not developed using discord.js. Therefore, I created new bundle like this.

As for the API, I referred to [tpc3/nodecg-PCCCommunity](https://github.com/tpc3/nodecg-PCCCommunity). Some parts have become imitations as a result.

## Todo

- I want to send message from dashboard to the channel streaming via the bot :)


