const path = require("path")
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
if(process.argv[2] == undefined || process.argv[2] == "dev"){
    const ENV_PATH = path.join(__dirname, '../.env_dev');
    require("dotenv").config({path: ENV_PATH})
}else if(process.argv[2] == "kose"){
    const ENV_PATH = path.join(__dirname, '../.env_kose');
    require("dotenv").config({path: ENV_PATH})
}else if(process.argv[2] == "pro"){
    const ENV_PATH = path.join(__dirname, '../.env_product');
    require("dotenv").config({path: ENV_PATH})
}
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.TOKEN
const commands = [
    new SlashCommandBuilder()
    .setName('echo')
    .setDescription('入力文字列を復唱します')
    .addStringOption(option => option.setName('復唱文字').setDescription('復唱文字を入力してください')),
    new SlashCommandBuilder()
    .setName('janken')
    .setDescription('じゃんけんを行いピックを決定します')
    .addUserOption(option => option.setName('ユーザ1').setDescription('ユーザ1を選択してください'))
    .addUserOption(option => option.setName('ユーザ2').setDescription('ユーザ2を選択してください'))
    .addStringOption(option => option.setName('マッチid').setDescription('マッチidを入力してください'))
    .addIntegerOption(option => option.setName('bo').setDescription('試合マップ数(bo)を入力してください')),
    new SlashCommandBuilder()
    .setName('janken_init')
    .setDescription('じゃんけんの初期化を行います')
    .addIntegerOption(option => option.setName('チャンネル数').setDescription('全チャンネル数を入力してください'))
    .addIntegerOption(option => option.setName('チャンネル指定').setDescription('チャンネルを指定してください')),
    new SlashCommandBuilder()
    .setName('sudo')
    .setDescription('管理者権限を得られます')
    .addBooleanOption(option => option.setName('与奪').setDescription('trueの場合は権限付与、falseの場合は権限剥奪')),
]
    .map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
