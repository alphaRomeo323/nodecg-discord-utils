const { Client, GatewayIntentBits, Events } = require('discord.js');
const Discord = require('discord.js');
const commands = ["ping","help","enable","stop"]
const bot = require('./bot');
const api = require('./api');
let temp ;

module.exports = function (nodecg) {

    connection = undefined;

    const router = nodecg.Router();

    api(router, nodecg);

    const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent]});

    client.once(Events.ClientReady, c => {
        nodecg.log.info(`Ready! Logged in as ${c.user.tag}`);
        bot(client, nodecg.bundleConfig, nodecg);
    });

    nodecg.Replicant("mode").once("change",(newValue) => {
        nodecg.Replicant("vc").value = [];
        if(newValue=="api" || nodecg.bundleConfig.botToken == ""){
            nodecg.mount("/discordutils_api", router);
            nodecg.log.info(`Discord Utilities is runnning in API mode.`);
        }
        else{
            client.login(nodecg.bundleConfig.botToken);
        }
    })
}