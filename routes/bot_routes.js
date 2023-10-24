/*
    各ルートに対する処理の分岐を定義
*/

module.exports = function(client){
    const bot_task = require("../controller/bot_controller")

    //ボットの起動が完了した場合
    client.on('ready', () => {
        bot_task.ready(client)
    });
    
    //登録したコマンドが実行された場合
    client.on('interactionCreate', async interaction => {
        await bot_task.interction(interaction, client)
    })

    //メッセージが送信された場合
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

    //メッセージに対してリアクションがついた場合
    client.on('messageReactionAdd', async (MessageReaction, user) => {
        //console.log(MessageReaction)
        await bot_task.ReactionAdd(MessageReaction, user, client)
    })

    //サーバに新しいメンバーが加入した場合
    client.on('guildMemberAdd', async guildMember => {
        await bot_task.addedMember(guildMember)
    })
}