const { AttachmentBuilder, RichEmbed } = require('discord.js')
const path = require("path")
const Canvas = require('canvas');
const DB = require("./DB_controller")
const Err = require("./error_handler")
const API = require("./request_controller")
const JankenMess = require("./message_handler");
const { group } = require('console');
if(process.argv[2] == undefined || process.argv[2] == "dev"){
    const ENV_PATH = path.join(__dirname, '.env_dev');
    require("dotenv").config({path: ENV_PATH})
}else if(process.argv[2] == "kose"){
    const ENV_PATH = path.join(__dirname, '.env_kose');
    require("dotenv").config({path: ENV_PATH})
}else if(process.argv[2] == "pro"){
    const ENV_PATH = path.join(__dirname, '.env_product');
    require("dotenv").config({path: ENV_PATH})
}
console.log(process.argv[2])

const janken_hand = ["✊","✌️","🖐️"]
const pick_num = ["1⃣","2⃣"]
const pick_name = ["マップ選択権","攻守選択権"]
const pick_status = ["Map","AtkDef"]
const map_num = ["1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣"]
const map_name = ["アセント","バインド","ヘイブン","アイスボックス","ブリーズ","フラクチャー","パール"]
const AtkDef_char = ["🇦","🇩"]
const AtkDef_name = ["Attacker Start","Defender Start"]
const AtkDef_status = ["Attacker","Defender"]

exports.interction = async function(interaction, client){
    if(!interaction.isChatInputCommand()) return;
    console.log("interactionCreate")
    
    if(interaction.commandName === 'echo') {
        if(interaction.options.getString("復唱文字") == null){
            await interaction.reply("nullやぞ").catch(console.error);
            return
        }
        await interaction.reply(interaction.options.getString("復唱文字")).catch(console.error);
        return 
    }

    if(interaction.commandName === 'janken'){
        await startJanken(interaction, client)
        return
    }

    if(interaction.commandName === 'janken_init'){
        await jankenInit(interaction)
        return
    }

    if(interaction.commandName === 'group_results'){
        await groupResultSender(interaction, client)
        return
    }

    if(interaction.commandName === 'sudo'){
        await sudoHandler(interaction, client)
        return
    }

}

exports.ReactionAdd = async function(MessageReaction, user, client){
    if(user.bot) return
    console.log("messageReactionAdd")
    let user_num = 1
    let results_selct = await DB.DB_query("select * from `janken` where `user1_id` = " + user.id)
    if(results_selct.length == 0){
        user_num = 2
        results_selct = await DB.DB_query("select * from `janken` where `user2_id` = " + user.id)
        if(results_selct.length == 0) return
    }
    let set_data = results_selct[0]

    if(set_data.status == "jankenStart"){
        //console.log(MessageReaction)
        jankenStart_handler(MessageReaction, user, client)
        return
    }
    if(set_data.status == "firstBanByWinner"){
        BanByWinner_handler(MessageReaction, user, client, 1)
        return
    }
    if(set_data.status == "firstBanByLoser"){
        BanByLoser_handler(MessageReaction, user, client, 1)
        return
    }
    if(set_data.status == "map1_pickSelect"){
        PickSelect_handler(MessageReaction, user, client, 1)
        return
    }
    if(set_data.status == "map1_mapPick"){
        MapPick_handler(MessageReaction, user, client, 1)
        return
    }
    if(set_data.status == "map1_AtkDefPick"){
        AtkDefPick_handler(MessageReaction, user, client, 1)
        return
    }
    if(set_data.status == "map2_pickSelect"){
        PickSelect_handler(MessageReaction, user, client, 2)
        return
    }
    if(set_data.status == "map2_mapPick"){
        MapPick_handler(MessageReaction, user, client, 2)
        return
    }
    if(set_data.status == "map2_AtkDefPick"){
        AtkDefPick_handler(MessageReaction, user, client, 2)
        return
    }
    if(set_data.status == "secondBanByWinner"){
        BanByWinner_handler(MessageReaction, user, client, 2)
        return
    }
    if(set_data.status == "secondBanByLoser"){
        BanByLoser_handler(MessageReaction, user, client, 2)
        return
    }
    if(set_data.status == "map3_pickSelect"){
        PickSelect_handler(MessageReaction, user, client, 3)
        return
    }
    if(set_data.status == "map3_mapPick"){
        MapPick_handler(MessageReaction, user, client, 3)
        return
    }
    if(set_data.status == "map3_AtkDefPick"){
        AtkDefPick_handler(MessageReaction, user, client, 3)
        return
    }

}

async function jankenStart_handler(MessageReaction, user, client){
    let user_num = 1
    let results_selct = await DB.DB_query("select * from `janken` where `waitUser1_hand_MessID` = " + MessageReaction.message.id)
    if(results_selct.length == 0){
        user_num = 2
        results_selct = await DB.DB_query("select * from `janken` where `waitUser2_hand_MessID` = " + MessageReaction.message.id)
        if(results_selct.length == 0) return
    }
    if(user_num == 1){
        if(!results_selct[0].waitUser1_hand){
            return
        }
    }else if(user_num == 2){
        if(!results_selct[0].waitUser2_hand){
            return
        }
    }
    let set_data = results_selct[0]
    let results_update
    for(let i=0; i<janken_hand.length; i++){
        if(MessageReaction._emoji.name == janken_hand[i]){
            //console.log(MessageReaction._emoji.name, user_num)
            if(user_num == 1){
                set_data.waitUser1_hand = false
                set_data.User1_hand = i
            }else if(user_num == 2){
                set_data.waitUser2_hand = false
                set_data.User2_hand = i
            }
            results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `user"+user_num+"_id` = " + user.id , set_data)
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            sendDM(client,user.id,"あなたの手は "+janken_hand[i]+" です")
            break
        }
        if(i==janken_hand.length-1){
            //await sendDM(client,user.id,JankenMess.message_handler(110))
            return
        }
    }

    let janken_winner
    results_selct = await DB.DB_query("select * from `janken` WHERE `user"+user_num+"_id` = " + user.id)
    if(!results_selct[0].waitUser1_hand && !results_selct[0].waitUser2_hand){
        janken_winner = doJanken(results_selct[0].User1_hand,results_selct[0].User2_hand)
    }else{
        return
    }

    set_data = results_selct[0]
    let sent_message_1
    let sent_message_2
    if(janken_winner == 0){
        await sendCM(client,set_data.comChannel_ID,JankenMess.message_handler(0)+janken_hand[set_data.User1_hand]+" <@"+set_data.user1_id+"> \n"+janken_hand[set_data.User2_hand]+" <@"+set_data.user2_id+"> \nあいこです。")
        sent_message_1 = await sendDM(client,set_data.user1_id,JankenMess.message_handler(120))
        sent_message_2 = await sendDM(client,set_data.user2_id,JankenMess.message_handler(120))
        set_data.waitUser1_hand_MessID = sent_message_1.id
        set_data.waitUser2_hand_MessID = sent_message_2.id
        set_data.waitUser1_hand = true
        set_data.waitUser2_hand = true
        set_data.User1_hand = null
        set_data.User2_hand = null
        results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `user"+user_num+"_id` = " + user.id , set_data)
        if(!results_update){
            await interaction.reply(Err.error_handler(700))
            return
        }
        for(let i=0; i<janken_hand.length; i++){
            await setReaction(sent_message_1,janken_hand[i])
            await setReaction(sent_message_2,janken_hand[i])
        }
    }else{
        set_data.end_janken = true
        set_data.status = "firstBanByWinner"
        if(janken_winner == 1){
            set_data.jankenWinner_ID = set_data.user1_id
            set_data.jankenLoser_ID = set_data.user2_id
        }else if(janken_winner == 2){
            set_data.jankenWinner_ID = set_data.user2_id
            set_data.jankenLoser_ID = set_data.user1_id
        }
        await sendCM(client,set_data.comChannel_ID,JankenMess.message_handler(0)+janken_hand[set_data.User1_hand]+" <@"+set_data.user1_id+"> \n"+janken_hand[set_data.User2_hand]+" <@"+set_data.user2_id+"> \n<@"+set_data.jankenWinner_ID+"> の勝利です。")
        sent_message_1 = await sendDM(client,set_data.jankenWinner_ID,JankenMess.message_handler(130))
        sent_message_2 = await sendDM(client,set_data.jankenLoser_ID,JankenMess.message_handler(131))
        set_data.firstBanByWinner_MessID = sent_message_1.id
        results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `user"+user_num+"_id` = " + user.id , set_data)
        if(!results_update){
            await interaction.reply(Err.error_handler(700))
            return
        }
        for(let i=0; i<map_num.length; i++){
            await setReaction(sent_message_1,map_num[i])
        }
    }
}

function doJanken(user1_hand, user2_hand){
    //引数      0はグー,1はチョキ,2はパー
    //返り値    0はあいこ, 1・2は勝者
    if(user1_hand == user2_hand){
        return 0
    }
    if(user1_hand == 0){
        if(user2_hand == 1){
            return 1
        }else if(user2_hand == 2){
            return 2
        }
    }else if(user1_hand == 1){
        if(user2_hand == 0){
            return 2
        }else if(user2_hand == 2){
            return 1
        }
    }else if(user1_hand == 2){
        if(user2_hand == 0){
            return 1
        }else if(user2_hand == 1){
            return 2
        }
    }
}

async function BanByWinner_handler(MessageReaction, user, client, order){
    let results_selct
    if(order == 1){
        results_selct = await DB.DB_query("select * from `janken` where `firstBanByWinner_MessID` = " + MessageReaction.message.id)
    }else if(order == 2){
        results_selct = await DB.DB_query("select * from `janken` where `secondBanByWinner_MessID` = " + MessageReaction.message.id)
    }
    if(results_selct.length == 0){
        return
    }
    let set_data = results_selct[0]
    let results_update
    let send_str = ""
    for(let i=0; i<map_num.length; i++){
        if(order == 2){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1){
                if(i==map_num.length-1){
                    return
                }
                continue
            }
        }
        if(MessageReaction._emoji.name == map_num[i]){
            if(order == 1){
                set_data.status = "firstBanByLoser"
                set_data.firstBanByWinner = i+1
                results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `firstBanByWinner_MessID` = " + MessageReaction.message.id, set_data)
            }else if(order == 2){
                set_data.status = "secondBanByLoser"
                set_data.secondBanByWinner = i+1
                results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `secondBanByWinner_MessID` = " + MessageReaction.message.id, set_data)
            }
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            await sendDM(client,user.id,JankenMess.message_handler(0) + map_num[i]+" "+map_name[i]+"\nをBANしました。敗者がBANするまでお待ちください。")
            send_str += JankenMess.message_handler(0)+map_num[i]+" "+map_name[i]+"\nを勝者がBANしました。\n"+JankenMess.message_handler(135)
            break
        }
        if(i==map_num.length-1){
            return
        }
    }
    for(let i=0; i<map_num.length; i++){
        if(order == 1){
            if(i == set_data.firstBanByWinner-1) continue
        }else if(order == 2){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1 || i==set_data.secondBanByWinner-1) continue
        }
        send_str += map_num[i] + " " + map_name[i] + "\n"
    }
    let sent_message = await sendDM(client,set_data.jankenLoser_ID,send_str)
    if(order == 1){
        set_data.firstBanByLoser_MessID = sent_message.id
        results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `firstBanByWinner_MessID` = " + MessageReaction.message.id, set_data)
    }else if(order == 2){
        set_data.secondBanByLoser_MessID = sent_message.id
        results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `secondBanByWinner_MessID` = " + MessageReaction.message.id, set_data)
    }
    if(!results_update){
        await interaction.reply(Err.error_handler(700))
        return
    }
    for(let i=0; i<map_num.length; i++){
        if(order == 1){
            if(i == set_data.firstBanByWinner-1) continue
        }else if(order == 2){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1 || i==set_data.secondBanByWinner-1) continue
        }
        await setReaction(sent_message,map_num[i])
    }
}

async function BanByLoser_handler(MessageReaction, user, client, order){
    let results_selct
    if(order == 1){
        results_selct = await DB.DB_query("select * from `janken` where `firstBanByLoser_MessID` = " + MessageReaction.message.id)
    }else if(order == 2){
        results_selct = await DB.DB_query("select * from `janken` where `secondBanByLoser_MessID` = " + MessageReaction.message.id)
    }
    if(results_selct.length == 0){
        return
    }
    let set_data = results_selct[0]
    let results_update
    for(let i=0; i<map_num.length; i++){
        if(order == 1){
            if(i == set_data.firstBanByWinner-1){
                if(i==map_num.length-1){
                    return
                }
                continue
            }
        }else if(order == 2){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1 || i==set_data.secondBanByWinner-1){
                if(i==map_num.length-1){
                    return
                }
                continue
            }
        }
        if(MessageReaction._emoji.name == map_num[i]){
            if(order == 1){
                set_data.status = "map1_pickSelect"
                set_data.firstBanByLoser = i+1
                results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `firstBanByLoser_MessID` = " + MessageReaction.message.id, set_data)
            }else if(order == 2){
                set_data.status = "map3_pickSelect"
                set_data.secondBanByLoser = i+1
                results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `secondBanByLoser_MessID` = " + MessageReaction.message.id, set_data)
            }
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            await sendDM(client,user.id,JankenMess.message_handler(0) + map_num[i]+" "+map_name[i]+"\nをBANしました。\n")
            await sendDM(client,set_data.jankenWinner_ID,JankenMess.message_handler(0)+map_num[i]+" "+map_name[i]+"\nを敗者がBANしました。\n")
            break
        }
        if(i==map_num.length-1){
            return
        }
    }
    
    let sent_message
    if(order == 1){
        sent_message = await sendDM(client,set_data.jankenWinner_ID,JankenMess.message_handler(140))
        await sendDM(client,user.id,JankenMess.message_handler(141))
        set_data.map1_pickSelect_MessID = sent_message.id
        results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `firstBanByLoser_MessID` = " + MessageReaction.message.id, set_data)
    }else if(order == 2){
        sent_message = await sendDM(client,set_data.jankenWinner_ID,JankenMess.message_handler(200))
        await sendDM(client,user.id,JankenMess.message_handler(201))
        set_data.map3_pickSelect_MessID = sent_message.id
        results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `secondBanByLoser_MessID` = " + MessageReaction.message.id, set_data)
    }
    if(!results_update){
        await interaction.reply(Err.error_handler(700))
        return
    }
    for(let i=0; i<pick_num.length; i++){
        await setReaction(sent_message,pick_num[i])
    }
}

async function PickSelect_handler(MessageReaction, user, client, order){
    let results_selct = await DB.DB_query("select * from `janken` where `map"+order+"_pickSelect_MessID` = " + MessageReaction.message.id)
    if(results_selct.length == 0){
        return
    }
    let set_data = results_selct[0]
    let results_update
    for(let i=0; i<pick_num.length; i++){
        if(MessageReaction._emoji.name == pick_num[i]){
            set_data.status = "map"+order+"_mapPick"
            set_data["map"+order+"_pickSelect"] = pick_status[i]
            if(order == 1 || order == 3){
                if(i == 0){ //勝者がマップ選択権
                    set_data["map"+order+"_mapSelector_id"] = set_data.jankenWinner_ID
                    set_data["map"+order+"_AtkDefSelector_id"] = set_data.jankenLoser_ID
                }else if(i == 1){   //敗者がマップ選択権
                    set_data["map"+order+"_mapSelector_id"] = set_data.jankenLoser_ID
                    set_data["map"+order+"_AtkDefSelector_id"] = set_data.jankenWinner_ID
                }
            }else if(order == 2){
                if(i == 0){ //敗者がマップ選択権
                    set_data["map"+order+"_mapSelector_id"] = set_data.jankenLoser_ID
                    set_data["map"+order+"_AtkDefSelector_id"] = set_data.jankenWinner_ID
                }else if(i == 1){   //勝者がマップ選択権
                    set_data["map"+order+"_mapSelector_id"] = set_data.jankenWinner_ID
                    set_data["map"+order+"_AtkDefSelector_id"] = set_data.jankenLoser_ID
                }
            }
            results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `map"+order+"_pickSelect_MessID` = " + MessageReaction.message.id, set_data)
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            if(order == 1 || order == 3){
                await sendDM(client,set_data.jankenWinner_ID,JankenMess.message_handler(0) + pick_num[i]+" "+pick_name[i]+"\nを選択しました。\n")
                await sendDM(client,set_data.jankenLoser_ID,JankenMess.message_handler(0) + pick_num[i]+" "+pick_name[i]+"\nが選択されました。\n")
            }else if(order == 2){
                await sendDM(client,set_data.jankenLoser_ID,JankenMess.message_handler(0) + pick_num[i]+" "+pick_name[i]+"\nを選択しました。\n")
                await sendDM(client,set_data.jankenWinner_ID,JankenMess.message_handler(0) + pick_num[i]+" "+pick_name[i]+"\nが選択されました。\n")
            }
            break
        }
        if(i==pick_num.length-1){
            return
        }
    }

    let send_str = JankenMess.message_handler(150) + "**第"+order+"マップ**\n"
    for(let i=0; i<map_num.length; i++){
        if(order == 1){
            if(i == set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1) continue
        }else if(order == 2){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1) continue
        }else if(order == 3){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1 || i==set_data.secondBanByWinner-1 || i==set_data.secondBanByLoser-1){
                continue
            }
        }
        send_str += map_num[i] + " " + map_name[i] + "\n"
    }
    let sent_message = await sendDM(client,set_data["map"+order+"_mapSelector_id"],send_str)
    await sendDM(client,set_data["map"+order+"_AtkDefSelector_id"],JankenMess.message_handler(151))
    set_data["map"+order+"_mapPick_MessID"] = sent_message.id
    results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `map"+order+"_pickSelect_MessID` = " + MessageReaction.message.id, set_data)
    if(!results_update){
        await interaction.reply(Err.error_handler(700))
        return
    }
    for(let i=0; i<map_num.length; i++){
        if(order == 1){
            if(i == set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1) continue
        }else if(order == 2){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1) continue
        }else if(order == 3){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1 || i==set_data.secondBanByWinner-1 || i==set_data.secondBanByLoser-1){
                continue
            }
        }
        await setReaction(sent_message,map_num[i])
    }
}

async function MapPick_handler(MessageReaction, user, client, order){
    let results_selct = await DB.DB_query("select * from `janken` where `map"+order+"_mapPick_MessID` = " + MessageReaction.message.id)
    if(results_selct.length == 0){
        return
    }
    let set_data = results_selct[0]
    let results_update
    for(let i=0; i<map_num.length; i++){
        if(order == 1){
            if(i == set_data.firstBanByWinner-1 || i == set_data.firstBanByLoser-1){
                if(i==map_num.length-1){
                    return
                }
                continue
            }
        }else if(order == 2){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1){
                if(i==map_num.length-1){
                    return
                }
                continue
            }
        }else if(order == 3){
            if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1 || i==set_data.secondBanByWinner-1 || i==set_data.secondBanByLoser-1){
                if(i==map_num.length-1){
                    return
                }
                continue
            }
        }
        if(MessageReaction._emoji.name == map_num[i]){
            set_data.status = "map"+order+"_AtkDefPick"
            set_data["map"+order+"_mapPick"] = i+1
            results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `map"+order+"_mapPick_MessID` = " + MessageReaction.message.id, set_data)
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            await sendDM(client,set_data["map"+order+"_mapSelector_id"],JankenMess.message_handler(0) + map_num[i]+" "+map_name[i]+"\nを選択しました。\n攻守選択されるまでお待ちください。")
            await sendDM(client,set_data["map"+order+"_AtkDefSelector_id"],JankenMess.message_handler(0) + map_num[i]+" "+map_name[i]+"\nが選択されました。\n")
            break
        }
        if(i==map_num.length-1){
            return
        }
    }

    let send_str = JankenMess.message_handler(160) + "**第"+order+"マップ**  **"+map_name[set_data["map"+order+"_mapPick"]-1]+"**\n"
    for(let i=0; i<AtkDef_char.length; i++){
        send_str += AtkDef_char[i] + " " + AtkDef_name[i] + "\n"
    }
    let sent_message = await sendDM(client,set_data["map"+order+"_AtkDefSelector_id"],send_str)
    set_data["map"+order+"_AtkDefPick_MessID"] = sent_message.id
    results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `map"+order+"_mapPick_MessID` = " + MessageReaction.message.id, set_data)
    if(!results_update){
        await interaction.reply(Err.error_handler(700))
        return
    }
    for(let i=0; i<AtkDef_char.length; i++){
        await setReaction(sent_message,AtkDef_char[i])
    }
}

async function AtkDefPick_handler(MessageReaction, user, client, order){
    let results_selct = await DB.DB_query("select * from `janken` where `map"+order+"_AtkDefPick_MessID` = " + MessageReaction.message.id)
    if(results_selct.length == 0){
        return
    }
    let set_data = results_selct[0]
    let results_update
    for(let i=0; i<AtkDef_char.length; i++){
        if(MessageReaction._emoji.name == AtkDef_char[i]){
            if(order == 1){
                set_data.status = "map2_PickSelect"
            }else if(order == 2){
                set_data.status = "secondBanByWinner"
            }else if(order == 3){
                set_data.status = "complete"
            }
            set_data["map"+order+"_AtkDefPick"] = AtkDef_status[i]
            results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `map"+order+"_AtkDefPick_MessID` = " + MessageReaction.message.id, set_data)
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            await sendDM(client,set_data["map"+order+"_AtkDefSelector_id"],JankenMess.message_handler(0) + AtkDef_char[i]+" "+AtkDef_name[i]+"\nを選択しました。\n")
            await sendDM(client,set_data["map"+order+"_mapSelector_id"],JankenMess.message_handler(0) + AtkDef_char[i]+" "+AtkDef_name[i]+"\nが選択されました。\n")
            break
        }
        if(i==AtkDef_char.length-1){
            return
        }
    }

    await resultMessage_handler(client, set_data, order)

    let sent_message
    let send_str = ""
    if(set_data.status == "map2_PickSelect"){
        if(set_data.bo == 1){
            await PickComplete_handler(set_data.number, client)
        }else if(set_data.bo == 2 || set_data.bo == 3){
            sent_message = await sendDM(client,set_data.jankenLoser_ID,JankenMess.message_handler(170))
            await sendDM(client,set_data.jankenWinner_ID,JankenMess.message_handler(171))
            set_data.map2_pickSelect_MessID = sent_message.id
            results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `map"+order+"_AtkDefPick_MessID` = " + MessageReaction.message.id, set_data)
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            for(let i=0; i<pick_num.length; i++){
                await setReaction(sent_message,pick_num[i])
            }
        }
    }else if(set_data.status == "secondBanByWinner"){
        if(set_data.bo == 2){
            await PickComplete_handler(set_data.number, client)
        }else if(set_data.bo == 3){
            send_str += JankenMess.message_handler(180)
            for(let i=0; i<map_num.length; i++){
                if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1){
                    continue
                }
                send_str += map_num[i] + " " + map_name[i] + "\n"
            }
            sent_message = await sendDM(client,set_data.jankenWinner_ID,send_str)
            await sendDM(client,set_data.jankenLoser_ID,JankenMess.message_handler(181))
            set_data.secondBanByWinner_MessID = sent_message.id
            results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `map"+order+"_AtkDefPick_MessID` = " + MessageReaction.message.id , set_data)
            if(!results_update){
                await interaction.reply(Err.error_handler(700))
                return
            }
            for(let i=0; i<map_num.length; i++){
                if(i==set_data.firstBanByWinner-1 || i==set_data.firstBanByLoser-1 || i==set_data.map1_mapPick-1 || i==set_data.map2_mapPick-1){
                    continue
                }
                await setReaction(sent_message,map_num[i])
            }
        }
    }else if(set_data.status == "complete"){
        await PickComplete_handler(set_data.number, client)
    }
}

async function PickComplete_handler(number, client){
    let results_selct = await DB.DB_query("select * from `janken` where `number` = " + number)
    if(results_selct.length == 0){
        return
    }
    let set_data = results_selct[0]
    set_data.status = "complete"
    let results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `number` = " + number, set_data)
    if(!results_update){
        await interaction.reply(Err.error_handler(700))
        return
    }

    await sendDM(client, set_data.jankenWinner_ID, JankenMess.message_handler(0)+"以上でピックは終了です。じゃんけんの開始されたチャンネルを確認してください。\nGLHF")
    await sendDM(client, set_data.jankenLoser_ID, JankenMess.message_handler(0)+"以上でピックは終了です。じゃんけんの開始されたチャンネルを確認してください。\nGLHF")
    await sendCM(client, set_data.comChannel_ID, JankenMess.message_handler(0)+"以上でピックは終了です。")

    let send_str = "\n\n"
    if(set_data.streaming){
        send_str += "配信試合のため、運営の指示があるまでお待ちください。"
    }else{
        let Attacker_id
        let Defender_id
        if(set_data.map1_AtkDefPick == "Attacker"){
            Attacker_id = set_data.map1_AtkDefSelector_id
            Defender_id = set_data.map1_mapSelector_id
        }else if(set_data.map1_AtkDefPick == "Defender"){
            Attacker_id = set_data.map1_mapSelector_id
            Defender_id = set_data.map1_AtkDefSelector_id
        }
        send_str += "それでは、両チームの代表者はルールブックに従いマッチを開始してください。\n主な流れは以下の通りです。\n\n"
        send_str += "先攻チームの代表者 <@"+Attacker_id+"> さんが RiotID&Tagline を伝え、"
        send_str += "後攻チームの代表者 <@"+Defender_id+"> さんはフレンド申請を行ってください。\n"
        send_str += "次に、後攻チームの代表者 <@"+Defender_id+"> さんはルールブックに従い各種設定をしてカスタムマッチを作成し、"
        send_str += "自チームのメンバーを招待して参加完了後、先攻チームの代表者を招待してください。\n\n"
        if(set_data.match_type != null){
            send_str += "カスタムマッチの設定は以下の通りです\n"
            send_str += "----------------------\n"
            send_str += "モード : スタンダード\n"
            send_str += "サーバ : Tokyo1\n"
            send_str += "チートを許可 : オフ\n"
            send_str += "トーナメントモード : オン\n"
            if(set_data.match_type == "group"){
                send_str += "オーバータイム : **オフ**\n"
            }else if(set_data.match_type == "tournament"){
                send_str += "オーバータイム : **オン**\n"
            }
            send_str += "全ラウンドをプレイ : オフ\n"
            send_str += "対戦履歴 : オン\n"
            send_str += "----------------------"
        }
    }

    await sendCM(client, set_data.comChannel_ID, send_str)
}

async function resultMessage_handler(client, data, order){
    let send_str = JankenMess.message_handler(0)
    send_str += "**第"+order+"マップ**\n"
    send_str += map_name[data["map"+order+"_mapPick"]-1]
    send_str += "  (Selected By "+"<@"+data["map"+order+"_mapSelector_id"]+">)\n"
    if(data["map"+order+"_AtkDefPick"] == "Attacker"){
        send_str += "Attacker Start -> <@"+data["map"+order+"_AtkDefSelector_id"]+">\n"
        send_str += "Defender Start -> <@"+data["map"+order+"_mapSelector_id"]+">\n"
    }else if(data["map"+order+"_AtkDefPick"] == "Defender"){
        send_str += "Attacker Start -> <@"+data["map"+order+"_mapSelector_id"]+">\n"
        send_str += "Defender Start -> <@"+data["map"+order+"_AtkDefSelector_id"]+">\n"
    }
    await sendCM(client,data.comChannel_ID,send_str)
}

async function startJanken(interaction, client){
    let user_1 = interaction.options.getUser("ユーザ1")
    let user_2 = interaction.options.getUser("ユーザ2")
    const matchId = interaction.options.getString("マッチid")
    let bo = interaction.options.getInteger("bo")
    let getJson_GM
    let getJson_TD_1
    let getJson_TD_2
    let _setFromMatchID = false
    if(user_1 == null || user_2 == null){
        if(matchId == null){
            await interaction.reply(Err.error_handler(110))
            return
        }
        getJson_GM = await API.getGroupMatchData(matchId)
        if(!getJson_GM){
            await interaction.reply(Err.error_handler(115))
            return
        }
        if(!(getJson_GM.bo==1 || getJson_GM.bo==2 || getJson_GM.bo==3)){
            await interaction.reply(Err.error_handler(120))
            return
        }
        bo = getJson_GM.bo
        user_1 = {}
        user_2 = {}
        getJson_TD_1 = await API.getTeamDataByID(getJson_GM.teams[0].id)
        getJson_TD_2 = await API.getTeamDataByID(getJson_GM.teams[1].id)
        if(!getJson_TD_1 || !getJson_TD_2){
            await interaction.reply(Err.error_handler(125))
            return
        }
        if(getJson_TD_1.team.discord_id == null || getJson_TD_2.team.discord_id == null){
            await interaction.reply(Err.error_handler(130))
            return
        }
        user_1.id = getJson_TD_1.team.discord_id
        user_2.id = getJson_TD_2.team.discord_id
        _setFromMatchID = true
    }else if(user_1.bot || user_2.bot){
        await interaction.reply(Err.error_handler(135))
        return
    }else{
        if(bo == null){
            getJson_GM = await API.getGroupMatchData(matchId)
            if(!getJson_GM){
                await interaction.reply(Err.error_handler(140))
                return
            }
            if(getJson_GM.bo != undefined && (getJson_GM.bo==1 || getJson_GM.bo==2 || getJson_GM.bo==3)){
                bo = getJson_GM.bo
                _setFromMatchID = true
            }else{
                await interaction.reply(Err.error_handler(145))
                return
            }
        }else{
            if(bo!=1 && bo!=2 && bo!=3){
                await interaction.reply(Err.error_handler(150))
                return
            }
        }
    }
    await interaction.reply("入力コマンド \n janken user1:<@"+user_1.id+"> "+"user2:<@"+user_2.id+"> MatchID:"+matchId+" BO:"+bo)
    if(_setFromMatchID){
        let send_mess = ""
        send_mess += "[MatchID] : "+getJson_GM.id+"\n"
        send_mess += "[BO] : "+getJson_GM.bo+"\n"
        send_mess += "[Streaming] : "+getJson_GM.streaming+"\n"
        send_mess += "[VS] : \n"
        send_mess += "    " + getJson_GM.teams[0].team_name + "  (id : " + getJson_GM.teams[0].id + " ) <@"+user_1.id+">\n"
        send_mess += "              VS\n"
        send_mess += "    " + getJson_GM.teams[1].team_name + "  (id : " + getJson_GM.teams[1].id + " ) <@"+user_2.id+">\n"
        await sendCM(client, interaction.channelId, send_mess)
    }
    let results_selct = await DB.DB_query("select * from `janken` where `comChannel_ID` = " + interaction.channelId)
    if(results_selct.length == 0){
        await interaction.reply(Err.error_handler(210))
        return
    }
    let set_data = results_selct[0]
    set_data.user1_id = user_1.id
    set_data.user2_id = user_2.id
    set_data.match_id = matchId
    set_data.bo = bo
    if(_setFromMatchID){
        set_data.streaming = getJson_GM.streaming
        set_data.match_type = getJson_GM.type
    }
    set_data.status = "jankenStart"
    let sent_message_1 = await sendDM(client,user_1.id,JankenMess.message_handler(100))
    let sent_message_2 = await sendDM(client,user_2.id,JankenMess.message_handler(100))
    set_data.waitUser1_hand_MessID = sent_message_1.id
    set_data.waitUser2_hand_MessID = sent_message_2.id
    let results_update = await DB.DB_query("UPDATE `janken` set ? WHERE `comChannel_ID` = " + interaction.channelId , set_data)
    if(!results_update){
        await interaction.reply(Err.error_handler(700))
        return
    }
    for(let i=0; i<janken_hand.length; i++){
        await setReaction(sent_message_1,janken_hand[i])
        await setReaction(sent_message_2,janken_hand[i])
    }
}

async function jankenInit(interaction){
    const Channel_num = interaction.options.getInteger("チャンネル数")
    const set_Channel = interaction.options.getInteger("チャンネル指定")
    if(Channel_num != null && set_Channel != null){
        await interaction.reply(Err.error_handler(10))
        return
    }
    if(Channel_num == null && set_Channel == null){
        await interaction.reply(Err.error_handler(20))
        return
    }

    let initData = {
        "user1_id" : null,
        "user2_id" : null,
        "match_id" : null,
        "bo" : null,
        "streaming" : false,
        "match_type" : null,
        "status" : "none",
        "waitUser1_hand" : true,
        "waitUser2_hand" : true,
        "end_janken" : false,
        "waitUser1_hand_MessID" : null,
        "waitUser2_hand_MessID" : null,
        "User1_hand" : null,
        "User2_hand" : null,
        "jankenWinner_ID" : null,
        "jankenLoser_ID" : null,

        "firstBanByWinner_MessID" : null,
        "firstBanByLoser_MessID" : null,
        "map1_pickSelect_MessID" : null,
        "map1_mapPick_MessID" : null,
        "map1_AtkDefPick_MessID" : null,
        "map2_pickSelect_MessID" : null,
        "map2_mapPick_MessID" : null,
        "map2_AtkDefPick_MessID" : null,
        "secondBanByWinner_MessID" : null,
        "secondBanByLoser_MessID" : null,
        "map3_pickSelect_MessID" : null,
        "map3_mapPick_MessID" : null,
        "map3_AtkDefPick_MessID" : null,

        "firstBanByWinner" : null,
        "firstBanByLoser" : null,
        "map1_pickSelect" : "none",
        "map1_mapSelector_id" : null,
        "map1_AtkDefSelector_id" : null,
        "map1_mapPick" : null,
        "map1_AtkDefPick" : "none",
        "map2_pickSelect" : "none",
        "map2_mapSelector_id" : null,
        "map2_AtkDefSelector_id" : null,
        "map2_mapPick" : null,
        "map2_AtkDefPick" : "none",
        "secondBanByWinner" : null,
        "secondBanByLoser" : null,
        "map3_pickSelect" : "none",
        "map3_mapSelector_id" : null,
        "map3_AtkDefSelector_id" : null,
        "map3_mapPick" : null,
        "map3_AtkDefPick" : "none",
    }
    let results_insert
    if(Channel_num != null){
        let channel_id = ""
        for(let i=0;i<Channel_num;i++){
            channel_id = "JANKEN_CHANNEL_ID_" + (i+1)
            if(process.env[channel_id] == undefined){
                await interaction.reply(Err.error_handler(200)+" ["+(i+1)+"]")
                return
            }
        }
        let results_del = await DB.DB_query("delete from `janken`")
        if(!results_del){
            await interaction.reply(Err.error_handler(700))
            return
        }
        for(let i=0; i<Channel_num; i++){
            channel_id = "JANKEN_CHANNEL_ID_" + (i+1)
            initData["number"] = i+1
            initData["comChannel_ID"] = process.env[channel_id]
            results_insert = await DB.DB_query("INSERT INTO `janken` set ? " , initData)
            if(!results_insert){
                await interaction.reply(Err.error_handler(700))
                return
            }
        }
    }
    let results_select
    if(set_Channel != null){
        results_select = await DB.DB_query("SELECT * FROM `janken` WHERE `number` = " + set_Channel)
        if(!results_select){
            await interaction.reply(Err.error_handler(700))
            return
        }
        if(results_select.length == 0){
            await interaction.reply(Err.error_handler(100))
            return
        }
        initData["number"] = set_Channel
        results_insert = await DB.DB_query("UPDATE `janken` set ? WHERE `number` = " + set_Channel , initData)
        if(!results_insert){
            await interaction.reply(Err.error_handler(700))
            return
        }
    }
    interaction.reply("complete")
}

async function sendDM(client,user_id,message){
    let return_mess
    await client.users.cache.get(user_id).send(message).then(function(message){
        return_mess = message
    })
    return return_mess
}
async function sendCM(client,channel_id,message){
    let return_mess
    await client.channels.cache.get(channel_id).send(message).then(function(message){
        return_mess = message
    })
    return return_mess
}

async function setReaction(message,Reaction){
    await message.react(Reaction)
}

async function sudoHandler(interaction, client){
    if(process.env.ADMIN_ROLE_ID == undefined){
        await interaction.reply(Err.error_handler(300)).catch(console.error);
        return
    }
    const _GiveTake = interaction.options.getBoolean("与奪")
    if(_GiveTake == undefined || _GiveTake == null){
        await interaction.reply(Err.error_handler(320)).catch(console.error);
        return
    }
    if(_GiveTake){
        try {
            await interaction.member.roles.add(process.env.ADMIN_ROLE_ID)
        } catch (error) {
            interaction.reply(Err.error_handler(310)).catch(console.error)
            console.log(error)
        }
    }else{
        try {
            await  interaction.member.roles.remove(process.env.ADMIN_ROLE_ID)
        } catch (error) {
            interaction.reply(Err.error_handler(310)).catch(console.error)
            console.log(error)
        }
    }
    await interaction.reply("complete").catch(console.error)
    return
}

async function groupResultSender(interaction, client){
    const AllorSet = interaction.options.getString("表示タイプ")
    const group_name = interaction.options.getString("グループ名")
    if(AllorSet == "set_group" && group_name == null){
        interaction.reply(Err.error_handler(400))
        return
    }
    getJson_GD = await API.getGroupData()
    if(!getJson_GD){
        await interaction.reply(Err.error_handler(405))
        return
    }
    let send_str = ""
    for(let i=0; i<getJson_GD.groups.length; i++){
        if(AllorSet == "set_group"){
            if(getJson_GD.groups[i].group_name != group_name) continue
        }
        getJson_GD.groups[i].teams.sort(function(a,b){ //一旦ポイントでソート
            if(a.rank > b.rank){
                return 1
            }else{
                return -1
            }
        })
        send_str += "グループ名 : " + getJson_GD.groups[i].group_name + "\n"
    }
    if(send_str == ""){
        await interaction.reply(Err.error_handler(410))
        return
    }
    await interaction.reply(send_str)

    console.log(getJson_GD.groups[0].teams)
}

exports.addedMember = async function(guildMember){
    console.log("added Member")
    const channel = await guildMember.guild.channels.cache.find(channel => channel.name === process.env.WELCOME_CHANNEL)

    if(channel == undefined){
        console.log("WelcomeChannel is not found")
        return
    }

    const canvas = Canvas.createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./components/member_add.jpg');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.heigh)

    let text_width = 0.0;
    
    ctx.font = '80px serif';
    ctx.fillStyle = '#ff4654';
    text_width = ctx.measureText(`${guildMember.user.username}`);
    ctx.fillText(`${guildMember.user.username}`, canvas.width/2.0 + canvas.width/4.0 - text_width.width/2.0, canvas.height / 2.0 + canvas.height / 4.8);

    ctx.beginPath();
    ctx.arc(canvas.width/2.0 + canvas.width/3.9, canvas.height/2.0 - canvas.height/8.0, 250, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(guildMember.user.displayAvatarURL({ extension: 'jpg'}));
    ctx.drawImage(avatar, canvas.width/2.0 + canvas.width/3.9 - 250, canvas.height/2.0 - canvas.height/8.0 - 250, 500, 500);

    const attachment = await new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');
    
    channel.send(`ようこそ ${guildMember}さん!`)
    channel.send({files:[attachment]})

}

exports.ready = async function(client){
    console.log(`Logged in as ${client.user.tag}`);
    const channel = await client.channels.cache.find(channel => channel.id === process.env.STATUS_CHANNEL_ID)
    if(channel == undefined){
        console.log("StatusChannel is not found")
        return
    }
    await channel.send("起動完了")
}