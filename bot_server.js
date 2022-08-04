const path = require("path")
const {Client, GatewayIntentBits, Partials} = require('discord.js')
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ]
})
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
const token = process.env.TOKEN

var routes = require("./routes/bot_routes")
routes(client)

client.login(token)

