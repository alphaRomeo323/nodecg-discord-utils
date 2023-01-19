const { Client, Events, } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const Discord = require('discord.js');

module.exports = (client, config, nodecg) => {
    connection = undefined;
    connectionChannel = undefined;
    observatingChannel = undefined;
    const prefix = config.prefix;
    const vcRep = nodecg.Replicant("vc");
    
    client.on(Events.MessageCreate, (message) => {

        if (message.author.username == client.user.username){
            return;
        }
        if (message.author.bot && ! getAllowLoggingBot(message.member.guild)){
            return;
        }
        if(!message.content.startsWith(prefix) || message.author.bot){
            //Text Chat Observation
            if (message.channel == observatingChannel){
                nodecg.Replicant("chat").value ={
                    'name': message.member.displayName,
                    'avatar': message.author.avatarURL(),
                    'content': message.content
                }
            }
            return;
        }
        else{
            // prefix + <some string> : ignore observation
            // Commands
            // prefix + ping: Pong!
            if(message.content == prefix + 'ping'){
                message.reply("Pong!");
            
            }
            // need roles
            if(!getGrantedRoles(message.member)){
                return;
            }
            if(message.content.startsWith(prefix + 'vcstream')){
                // prefix + 'vcstream enable' : start observating voice channel
                if (message.content.split(" ")[1] == 'start'){
                    if (connectionChannel === undefined && message.member.voice.channel !== undefined && message.member.voice.channel !== null){
                        connectionChannel = message.member.voice.channel;
                        connection = joinVoiceChannel({
                            channelId: connectionChannel.id,
                            guildId: connectionChannel.guild.id,
                            adapterCreator: connectionChannel.guild.voiceAdapterCreator,
                        });
                        updateVCMembers(message.member.voice.channel);
                        message.reply("started observation and streaming voice channel in " + message.member.voice.channel.name);
                    }
			        else
				        message.reply(`you're not in a voice channel!`);
                }
                // prefix + 'vcstream disable' : stop observating voice channel
                else if (message.content.split(" ")[1] == 'stop'){
                    if (connectionChannel !== undefined){
				        connection.destroy();
                        connectionChannel = undefined;
                        message.reply("voice channel observation is stopped");
                        vcRep.value = [];
                    }
			        else{
				        message.reply(`I'm not in a voice channel!`);
                    }
                }
                return;
                
            }
            if(message.content.startsWith(prefix + 'chatstream')){
                // prefix + 'chatstream enable' : start observating text channel
                if (message.content.split(" ")[1] == 'start'){
                    if ( message.channel != observatingChannel){
                        observatingChannel = message.channel;
                        message.reply("started observation and streaming text channel in #" + message.channel.name);
                    }
                    else{
                        message.reply(`already observating!`);
                    }
                }
                // prefix + 'chatstream disable' : stop observating text channel
                else if (message.content.split(" ")[1] == 'stop'){
                    if ( observatingChannel != undefined ){
                        observatingChannel = undefined;
                        message.reply("text channel observation is stopped");
                    }
                    else{
                        message.reply(`I'm not observating!`);
                    }
                }
                return;
            }
        }  
    })

    //Voice Channel Observation
    client.on(Events.VoiceStateUpdate, (oldMember, newMember) =>{
        if (connectionChannel != undefined){
            updateVCMembers(connectionChannel);
        }
    
    })

    //functions
    function getGrantedRoles(member){
        const guilds = config.guilds;
        var i,j,flag=false;
        for(i=0;i < guilds.length;i++){
            if (member.guild.id == guilds[i].id) {
                flag = true;
                break;
            }
        }
        if(!flag){ return false;}
        flag=false;
        for(j=0;j < guilds[i].roles.length;j++){
            if (member.roles.cache.has(guilds[i].roles[j])) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    
    function getAllowLoggingBot(guild_id){
        const guilds = config.guilds;
        var i;
        for(i=0;i < guilds.length;i++){
            if (guild_id == guilds[i].id) {
                return guilds[i].logbot;
            }
        }
        return false;
    }

    function updateVCMembers(channel){
        const members = channel.members
        var i;
        var temp = [];
        for(i=0;i<members.size;i++){
            member = new Discord.GuildMember()
            member = members.at(i)
            if( member.user.username == client.user.username ){
                continue;
            }
            if(member.user.bot && !getAllowLoggingBot(channel.guildId)){
                continue;
            }
            temp.push({
                'name': member.displayName,
                'avatar': member.user.avatarURL()
            })
        }
        vcRep.value = temp;
    }


}
