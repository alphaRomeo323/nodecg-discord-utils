const { inlineCode, channelMention, Events, Client } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const connectionStatus  = require("./connection");
const Commands = [ 'help', 'ping', 'chatstream', 'voicestream' ];
const Help = {
    'help': 'This Command.',
    'ping': 'Check the ping.',
    'chatstream': `${inlineCode('start')}/${inlineCode('stop')} streaming text chat`,
    'voicestream': `${inlineCode('start')}/${inlineCode('stop')} streaming voice channel`,
}


/**
 * Bot commands and actions
 * @param {Client} client 
 * @param {NodeCG} nodecg 
 */
module.exports = (client, nodecg) => {
    const prefix = nodecg.bundleConfig.prefix;
    const vcRep = nodecg.Replicant("vc");
    let chatOverlayId;
    let voiceOverlay;
    let connection;
    

    //textchat observation
    client.on(Events.MessageCreate, message => {
        if (message.author.username === client.user.username){
            return;
        }
        if (message.author.bot && !GetStreamBots(message.guild.id)){
            return;
        }
        if (message.content.startsWith(prefix)){
            return;
        }
        if (message.channel.id === chatOverlayId){
            nodecg.Replicant("chat").value ={
                name: message.member.displayName,
                avatar: message.author.avatarURL(),
                content: message.content
            }
        }
    });

    client.on(Events.MessageCreate, message =>{
        if (message.author.bot) return;
        if (! message.guild) return;
        if (! message.content.startsWith(prefix)) return;
        const command = message.content.replace(prefix, '');
        if (! Commands.includes(command.split(' ')[0])) return;
        //Commands without special roles
        if (command.startsWith("ping")){
            message.reply("Pong!");
            return;
        }
        if (command.startsWith("help")){
            let temp = ""
            for(let i=0;i<Commands.length;i++){
                temp += `${Commands[i]}: ${Help[Commands[i]]}\n`;
            }
            message.reply(temp);
            return;
        }

        if (
            !message.member.roles.cache.hasAny(...GetRoles(message.guild.id))
            && 
            message.author !== client.application.owner
        ) {
            message.reply(
                "You don't have any role to execute the command:" + inlineCode(command.split(' ')[0])
            )
            return;
        }
        //Commands needed special roles
        if (command.startsWith("chatstream start")){
            if(chatOverlayId === message.channel.id){
                message.reply("Already started!")
            }
            else {
                chatOverlayId = message.channel.id;
                message.reply("Started streaming text channel in " + channelMention(message.channel.id))
            }
            return;
        }
        if (command.startsWith("chatstream stop")){
            if(chatOverlayId === "" || chatOverlayId === undefined){
                message.reply("Already stopped!")
            }
            else{
                chatOverlayId = "";
                message.reply("Stopped streaming text chat")
            }
            return;
        }
        if (command.startsWith("voicestream start")){
            if(!message.member.voice.channel){
                message.reply("You're not in a voice channel!");
                return;
            }
            if(message.member.voice.channel === voiceOverlay){
                message.reply("Already connected!");
                return;
            }
            if (voiceOverlay !== undefined) stopVoiceStream();
            voiceOverlay = message.member.voice.channel;
            connection = joinVoiceChannel({
                    channelId: voiceOverlay.id,
                    guildId: voiceOverlay.guild.id,
                    adapterCreator: voiceOverlay.guild.voiceAdapterCreator,
            });
            message.reply("Started streaming voice channel in " + channelMention(voiceOverlay.id));
            connectionStatus(client, connection, nodecg, voiceOverlay, GetStreamBots(message.guild.id));
            return;
        }
        if (command.startsWith("voicestream stop")){
            if (typeof voiceOverlay !== "undefined"){
                stopVoiceStream();
                message.reply("Stopped streaming voice channel");
            }
            else{
                message.reply(`I'm not in a voice channel!`);
            }
            return;
        }
        message.reply("Command is wrong or undefined");
    })


    process.on("exit", () =>{
        if(typeof voiceOverlay !== "undefined") stopVoiceStream();
    })

    client.on(Events.VoiceStateUpdate, () => {
        if(voiceOverlay?.members.size <= 1) stopVoiceStream();
    });

    

    /**
     * check whether it will stream messages/voice from bots.
     * @param {string} guildId guild.id
     * @returns {boolean} 
     */
    function GetStreamBots(guildId){
        const guilds = nodecg.bundleConfig.guilds;
        for(let i = 0; i < guilds.length; i++){
            if ( guildId === guilds[i] ){
                return guilds[i].streamBots;
            }
        }
        return false;
    }
    /**
     * Return role IDs that can use commands to control streaming.
     * @param {string} guildId guild.id
     * @returns {Array<string>} list of role.id
     */
    const GetRoles = (guildId) => {
        const guilds = nodecg.bundleConfig.guilds;
        for(let i = 0; i < guilds.length; i++){
            if ( guildId === guilds[i].id ){
                return guilds[i].roles;
            }
        }
        return [];
    }

    /**
     * Destroy the connection and initialize objects. 
     */
    const stopVoiceStream = () => {
        connection.destroy();
        connection = undefined;
        voiceOverlay = undefined;
        vcRep.value = [];
    }
    
}
