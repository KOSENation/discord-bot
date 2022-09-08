exports.error_handler = function(err_code){
    let resStr = ""

    switch(err_code){
        case 10:
            resStr = "[Err:10] チャンネル数で初期化かチャンネル指定で初期化どちらかにしてください"
            break;
        case 20:
            resStr = "[Err:20] チャンネル数で初期化かチャンネル指定で初期化どちらか指定してください"
            break;
        case 30:
            resStr = "[Err:30] じゃんけんデータ保存用データベースの初期化が行われていません"
            break;
        case 100:
            resStr = "[Err:100] 指定Numberのデータベースが存在しません"
            break;
        case 110:
            resStr = "[Err:110] ユーザを指定しない場合MatchIDは必須です"
            break;
        case 111:
            resStr = "[Err:111] MatchIDは必須です"
            break;
        case 115:
            resStr = "[Err:115] 指定されたマッチIDが存在していません。"
            break;
        case 120:
            resStr = "[Err:120] 指定されたマッチのBOが正しく設定されていません。"
            break;
        case 125:
            resStr = "[Err:125] 指定マッチのチームデータが存在していません"
            break;
        case 130:
            resStr = "[Err:130] チームデータにDiscordIDが登録されていません。"
            break;
        case 135:
            resStr = "[Err:135] ボットが指定されています。"
            break;
        case 140:
            resStr = "[Err:140] 指定されたマッチIDが存在していません。"
            break;
        case 145:
            resStr = "[Err:145] 指定されたマッチのBOが正しく設定されていません。"
            break;
        case 150:
            resStr = "[Err:150] BOは1～3で指定してください。"
            break;
        case 200:
            resStr = "[Err:200] チャンネルIDが設定されていません"
            break;
        case 210:
            resStr = "[Err:210] このチャンネルは対象化されていません"
            break;
        case 300:
            resStr = "[Err:300] ADMINの権限を付与できません"
            break;
        case 310:
            resStr = "[Err:310] ADMINの権限を付与できません\n(このBOTに与えられている権限がADMIN権限より下の可能性があります)"
            break;
        case 320:
            resStr = "[Err:320] 権限与奪の引数を入力してください"
            break;
        case 400:
            resStr = "[Err:400] グループ指定の場合はグループ名のオプションを選択してください"
            break;
        case 405:
            resStr = "[Err:405] グループデータが存在していません。"
            break;
        case 410:
            resStr = "[Err:410] 指定グループのデータが存在していません。"
            break;
        case 700:
            resStr = "[Err:700] データベース操作時のエラー"
            break;
    }

    return resStr
}