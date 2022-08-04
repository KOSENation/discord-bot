module.exports = function(client){
    const bot_task = require("../controller/bot_controller")

    client.on('ready', () => {
        bot_task.ready(client)
    });
    
    client.on('interactionCreate', async interaction => {
        await bot_task.interction(interaction, client)
    })

    client.on('messageCreate', async message => {
        //console.log(message.content)
        //if(message.channel.type == 0){  //Guilds
        //    client.users.cache.get(message.author.id).send("aaaa").then(function(message){
        //        message.react("✊")
        //        message.react("✌️")
        //        message.react("🖐️")
        //        console.log(message.id)
        //    }).catch(console.error);
        //}
            //console.log(message.author)
        //}else if(message.channel.type == 1){    //DM
//
        //}
    })

    client.on('messageReactionAdd', async (MessageReaction, user) => {
        //console.log(MessageReaction)
        await bot_task.ReactionAdd(MessageReaction, user, client)
    })

    client.on('guildMemberAdd', async guildMember => {
        await bot_task.addedMember(guildMember)
    })
}