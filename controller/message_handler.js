exports.message_handler = function(mess_code, _isPriority){
    let resStr = ""

    if(!_isPriority || _isPriority == null || _isPriority == undefined){
        switch(mess_code){
            case 0:
                resStr = "-------------------------------------------------------------\n"
                break;
            case 100:
                resStr = "-------------------------------------------------------------\n"
                resStr += "じゃんけんを行いピックの順番を決定します。\n出したい手(✊・✌️・🖐️)のリアクションをこのメッセージに押してください。変更不可能なので注意してください。"
                break;
            case 110:
                resStr = "-------------------------------------------------------------\n"
                resStr += "✊・✌️・🖐️ を選択してください"
                break;
            case 120:
                resStr = "-------------------------------------------------------------\n"
                resStr += "あいこになりました。\nもう一度出したい手(✊・✌️・🖐️)のリアクションをこのメッセージに押してください。変更不可能なので注意してください。"
                break;
            case 130:
                resStr = "-------------------------------------------------------------\n"
                resStr += "じゃんけんに勝利しました。\n\n"
                resStr += "マップBANを行います。BANしたいマップを選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                resStr += "1⃣ アセント\n"
                resStr += "2⃣ バインド\n"
                resStr += "3⃣ ヘイブン\n"
                resStr += "4⃣ アイスボックス\n"
                resStr += "5⃣ ブリーズ\n"
                resStr += "6⃣ フラクチャー\n"
                resStr += "7⃣ パール\n"
                break;
            case 131:
                resStr = "-------------------------------------------------------------\n"
                resStr += "じゃんけんに負けました。\n\n"
                resStr += "マップBANを行います。勝者がBANしたマップを除いたマップの中からBANするマップを選択できます。\n"
                resStr += "勝者が選択するまでおまちください。"
                break;
            case 135:
                resStr += "残った以下のマップからBANしたいマップを選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n"
                break;
            case 140:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックにうつります。\n"
                resStr += "あなたはじゃんけんの勝者であるため、第1マップのマップ選択権・攻守選択権どちらをピックするか指定できます。\n"
                resStr += "ピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n**第1マップ**\n"
                resStr += "1⃣ マップ選択権\n"
                resStr += "2⃣ 攻守選択権(Attacker Start or Defender Start)\n"
                break;
            case 141:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックにうつります。\n"
                resStr += "あなたはじゃんけんの敗者であるため、第1マップのマップ選択権・攻守選択権について勝者がピックしなかった方の権利を得ます。\n"
                resStr += "勝者が選択するまでおまちください。"
                break;
            case 150:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権を得ました。\n"
                resStr += "残っている以下のマップから選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 151:
                resStr = "-------------------------------------------------------------\n"
                resStr += "攻守選択権を得ました。\n"
                resStr += "マップが選択されるまでお待ちください。"
                break;
            case 160:
                resStr = "-------------------------------------------------------------\n"
                resStr += "攻守選択(Attacker Start or Defender Start)を行います。\n"
                resStr += "ピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 170:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックに戻ります。\n"
                resStr += "あなたはじゃんけんの敗者であるため、第2マップのマップ選択権・攻守選択権どちらをピックするか指定できます。\n"
                resStr += "ピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n**第2マップ**\n"
                resStr += "1⃣ マップ選択権\n"
                resStr += "2⃣ 攻守選択権(Attacker Start or Defender Start)\n"
                break;
            case 171:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックに戻ります。\n"
                resStr += "あなたはじゃんけんの勝者であるため、第2マップのマップ選択権・攻守選択権について敗者がピックしなかった方の権利を得ます。\n"
                resStr += "敗者が選択するまでおまちください。"
                break;
            case 180:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップBANを行います。BANしたいマップを選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 181:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップBANを行います。勝者がBANしたマップ及び今までBANもしくはピックされたマップを除いたマップの中からBANするマップを選択できます。\n"
                resStr += "勝者が選択するまでおまちください。"
                break;
            case 200:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックに戻ります。\n"
                resStr += "あなたはじゃんけんの勝者であるため、第3マップの攻守選択権を得ました。\n\n"
                //resStr += "ピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n**第3マップ**\n"
                //resStr += "1⃣ マップ選択権\n"
                //resStr += "2⃣ 攻守選択権(Attacker Start or Defender Start)\n"
                break;
            case 201:
                resStr = "-------------------------------------------------------------\n"
                resStr += "あなたはじゃんけんの敗者であるため、第3マップの攻守は勝者がピックしなかった方となります。\n\n"
                //resStr += "勝者が選択するまでおまちください。"
                break;
            case 205:
                resStr += "\n\nピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 206:
                resStr += "\n\n勝者が選択するまでおまちください。"
                break;
            //case 130:
            //    resStr = "-------------------------------------------------------------\n"
            //    resStr += "じゃんけんに勝利したので、マップ選択権か攻守選択権をピックできます。\n"
            //    resStr += "マップ選択権をピックする場合は1⃣\n"
            //    resStr += "攻守選択権をピックする場合は2⃣\n"
            //    resStr += "のリアクションをこのメッセージに押してください。変更不可能なので注意してください。"
            //    break;
            //case 131:
            //    resStr = "-------------------------------------------------------------\n"
            //    resStr += "じゃんけんに負けたので、勝者が選択しなかった方(マップ選択権か攻守選択権)についてピックできます。\n"
            //    resStr += "勝者が選択するまでおまちください。"
            //    break;
        }
    }else{
        switch(mess_code){
            case 0:
                resStr = "-------------------------------------------------------------\n"
                break;
            case 100:
                resStr = "-------------------------------------------------------------\n"
                resStr += "じゃんけんを行いピックの順番を決定します。\n出したい手(✊・✌️・🖐️)のリアクションをこのメッセージに押してください。変更不可能なので注意してください。"
                break;
            case 110:
                resStr = "-------------------------------------------------------------\n"
                resStr += "✊・✌️・🖐️ を選択してください"
                break;
            case 120:
                resStr = "-------------------------------------------------------------\n"
                resStr += "あいこになりました。\nもう一度出したい手(✊・✌️・🖐️)のリアクションをこのメッセージに押してください。変更不可能なので注意してください。"
                break;
            case 130:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップBANを行います。BANしたいマップを選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                resStr += "1⃣ アセント\n"
                resStr += "2⃣ バインド\n"
                resStr += "3⃣ ヘイブン\n"
                resStr += "4⃣ アイスボックス\n"
                resStr += "5⃣ ブリーズ\n"
                resStr += "6⃣ フラクチャー\n"
                resStr += "7⃣ パール\n"
                break;
            case 131:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップBANを行います。Upperからの進出チームがBANしたマップを除いたマップの中からBANするマップを選択できます。\n"
                resStr += "Upperからの進出チームが選択するまでおまちください。"
                break;
            case 135:
                resStr += "残った以下のマップからBANしたいマップを選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n"
                break;
            case 140:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックにうつります。\n"
                resStr += "あなたはUpperからの進出チームであるため、第1マップのマップ選択権・攻守選択権どちらをピックするか指定できます。\n"
                resStr += "ピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n**第1マップ**\n"
                resStr += "1⃣ マップ選択権\n"
                resStr += "2⃣ 攻守選択権(Attacker Start or Defender Start)\n"
                break;
            case 141:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックにうつります。\n"
                resStr += "あなたはLowerからの進出チームであるため、第1マップのマップ選択権・攻守選択権についてUpperからの進出チームがピックしなかった方の権利を得ます。\n"
                resStr += "Upperからの進出チームが選択するまでおまちください。"
                break;
            case 150:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権を得ました。\n"
                resStr += "残っている以下のマップから選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 151:
                resStr = "-------------------------------------------------------------\n"
                resStr += "攻守選択権を得ました。\n"
                resStr += "マップが選択されるまでお待ちください。"
                break;
            case 160:
                resStr = "-------------------------------------------------------------\n"
                resStr += "攻守選択(Attacker Start or Defender Start)を行います。\n"
                resStr += "ピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 170:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックに戻ります。\n"
                resStr += "あなたはLowerからの進出チームであるため、第2マップのマップ選択権・攻守選択権どちらをピックするか指定できます。\n"
                resStr += "ピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n**第2マップ**\n"
                resStr += "1⃣ マップ選択権\n"
                resStr += "2⃣ 攻守選択権(Attacker Start or Defender Start)\n"
                break;
            case 171:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックに戻ります。\n"
                resStr += "あなたはUpperからの進出チームであるため、第2マップのマップ選択権・攻守選択権についてLowerからの進出チームがピックしなかった方の権利を得ます。\n"
                resStr += "敗者が選択するまでおまちください。"
                break;
            case 180:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップBANを行います。BANしたいマップを選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 181:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップBANを行います。Upperからの進出チームがBANしたマップ及び今までBANもしくはピックされたマップを除いたマップの中からBANするマップを選択できます。\n"
                resStr += "Upperからの進出チームが選択するまでおまちください。"
                break;
            case 200:
                resStr = "-------------------------------------------------------------\n"
                resStr += "マップ選択権・攻守選択権のピックに戻ります。\n"
                resStr += "あなたはUpperからの進出チームであるため、第3マップの攻守選択権を得ました。\n\n"
                break;
            case 201:
                resStr = "-------------------------------------------------------------\n"
                resStr += "あなたはLowerからの進出チームであるため、第3マップの攻守はUpperからの進出チームがピックしなかった方となります。\n\n"
                break;
            case 205:
                resStr += "\n\nピックしたい方を選択し、対応するリアクションをこのメッセージに押してください。変更不可能なので注意してください。\n\n"
                break;
            case 206:
                resStr += "\n\nUpperからの進出チームが選択するまでおまちください。"
                break;
        }
    }

    return resStr
}