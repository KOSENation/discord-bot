# discord-bot

[KOSENation Gaming](https://kosenation.com/)が運営する[KOSENation CUP VALORANT 2022](https://kosenation.com/event/valorant/cup-2022/)で使用した
大会進行用ボットです

# 配信

- Day1

[![Day1](http://img.youtube.com/vi/CLI3sKtdWbA/0.jpg)](https://www.youtube.com/watch?v=CLI3sKtdWbA)

- Day2

[![Day2](http://img.youtube.com/vi/GRGJYqRVcbw/0.jpg)](https://www.youtube.com/watch?v=GRGJYqRVcbw)


## 内容

大会を進行するにあたって、各対戦のマップピック及び先攻後攻を決める必要がある。
これをDiscord上にてじゃんけんによって決め、そのすべてを自動的に行うボットである。

Discord上で決まった内容はKOSENationGaming独自のAPIであるValwind-API(非公開)にPOSTされ、決定した情報が保存される。
Valwind-APIのデータベースはGCPのCloudSQLを利用している。

じゃんけんの進行状況はローカルのデータベース(MySQL)に保存されるため、万が一進行が停止しても復帰することができる。
