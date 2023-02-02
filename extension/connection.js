const { Events,GuildMember } = require("discord.js");

module.exports = (client, connection, nodecg, channel, streamBots) => {
    const vcRep = nodecg.Replicant("vc")
    connection.receiver.speaking.on("start",(userID) =>{
        updateSpeakingState(String(userID), true);
    });
    connection.receiver.speaking.on("end",(userID) =>{
        updateSpeakingState(String(userID), false);
    });
    client.on(Events.VoiceStateUpdate, () => {
        updateVoiceState()
    });

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
    const updateSpeakingState = (userID, speaking) => {
        for(let i=0;i<vcRep.value.length;i++){
            if(vcRep.value[i].id === userID){
                    vcRep.value[i].speaking = speaking
            }
        }
    };

}