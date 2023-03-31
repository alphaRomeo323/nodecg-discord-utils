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
module.exports = (connection, nodecg) => {
    const vcRep = nodecg.Replicant("vc")
    //speaking observation
    connection.receiver.speaking.on("start",(userID) =>{
        updateSpeakingState(userID, true);
    });
    connection.receiver.speaking.on("end",(userID) =>{
        updateSpeakingState(userID, false);
    });

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