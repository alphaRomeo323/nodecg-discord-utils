const { Client, GatewayIntentBits, Events, interaction } = require('discord.js');
const bot = require('./bot');
const api = require('./api');

/**
 * 
 * @param { NodeCG } nodecg 
 */
module.exports = function (nodecg) {

    const router = nodecg.Router();
    const status = nodecg.Replicant("status")

    api(router, nodecg);

    const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent]});

    client.once(Events.ClientReady, c => {
        nodecg.log.info(`Ready! Logged in as ${c.user.tag}`);
        status.value = "bot"
        c.application.fetch().then(() => {
            bot(c, nodecg)
        });
    });

    nodecg.Replicant("vc").value = [];
    if( nodecg.bundleConfig.botToken == "" ){
        nodecg.mount("/discordutils_api", router);
        nodecg.log.info(`Discord Utilities is runnning in API mode.`);
        status.value = "api"
    }
    else{
        client.login(nodecg.bundleConfig.botToken);
    }
}