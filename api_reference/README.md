# NodeCG-Discord-Utils API

todo: translate to English

## /discordutils_api

nodecg-discord-utils bundleのAPIルーターです

このルーターは付属のdiscord.js botが起動していない際に有効になります。

複数のbotからAPIルーターにアクセスすることはおやめください。不具合の原因となります。

### /discordutils_api/chat

テキストチャットに関するデータを受け取ります。
データ形式はJSONです。
```json
{
    "name": "string",
    "avater": "string",
    "content": "string"
}
```
`name`: DisplayName of message auther
`avater`: URL of message auther's avatar
`content`: body of message

### /discordutils_api/vc

ボイスチャットに関するデータを受け取ります。
データ形式はJSONです。
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
`members`: Array of members in voice channel
`name`: DisplayName of member
`avater`: URL of member's avatar
`speaking`: Whether or not they are speaking (optional)

