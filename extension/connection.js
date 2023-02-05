const { VoiceConnection } = require("@discordjs/voice");
const { Events, GuildMember, Client, VoiceChannel } = require("discord.js");
/**
 * 
 * @param {Client} client 
 * @param {VoiceConnection} connection 
 * @param {NodeCG} nodecg 
 * @param {VoiceChannel} channel 
 * @param {boolean} streamBots 
 */
module.exports = (client, connection, nodecg, channel, streamBots) => {
    const vcRep = nodecg.Replicant("vc")
    connection.receiver.speaking.on("start",(userID) =>{
        updateSpeakingState(userID, true);
    });
    connection.receiver.speaking.on("end",(userID) =>{
        updateSpeakingState(userID, false);
    });
    client.on(Events.VoiceStateUpdate, () => {
        updateVoiceState()
    });
    /**
     * Update Replicant('vc')
     */
    const updateVoiceState = () => {
        const members = channel.members
        let temp = [];
        let member = new GuildMember()
        for(let i=0;i<members.size;i++){
            member = members.at(i)
            if( member.user.username == client.user.username ){
                continue;
            }
            if(member.user.bot && streamBots){
                continue;
            }
            temp.push({
                'name': member.displayName,
                'avatar': member.user.avatarURL(),
                'id':  member.id,
                'speaking': false
            })
        }
        vcRep.value = temp;
    };
    /**
     * Update speaking status when user is included by Replicant('vc')
     * @param {string} userID 
     * @param {boolean} speaking 
     */
    const updateSpeakingState = (userID, speaking) => {
        for(let i=0;i<vcRep.value.length;i++){
            if(vcRep.value[i].id === userID){
                    vcRep.value[i].speaking = speaking
            }
        }
    };

}