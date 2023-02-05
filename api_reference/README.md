# NodeCG-Discord-Utils API

This is API of nodecg-discord-utils. You can POST chat/voice data from external bot.

## /discordutils_api

When the bot included by the bundle is disabled (ex. token not found), the bundle enable the router.

Please don't POST datas from several bots.

### /discordutils_api/chat

You can POST here data about text chat.  
data type must be JSON.
```json
{
    "name": "string",
    "avater": "string",
    "content": "string"
}
```
- `name`: DisplayName of message auther
- `avater`: URL of message auther's avatar
- `content`: body of message

### /discordutils_api/vc

You can POST here data about users joining voice channel.  
data type must be JSON.
```json
{
    "members":[
        {
            "name":"string",
            "avatar": "string",
            "speaking": true
        }
    ]
}
```
- `members`: Array of members in voice channel
- `name`: DisplayName of member
- `avater`: URL of member's avatar
- `speaking`: Whether or not they are speaking (optional)

