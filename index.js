// Goal: Create a discord bot with the OpenAI API
require('dotenv').config();

// Get ready to connect to the Discord API
const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Prepare connection to OpenAI API
// const {Configuration, OpenAIApi} = require('openai');
// const configuration = new Configuration({
//     organization: process.env.OPENAI_ORG,
//     apiKey: process.env.OPENAI_KEY
// });

// const openai = new OpenAIApi(configuration);

// Check for when a message is sent
client.on('messageCreate', async function(message){
    try {
        if(message.author.bot) return;
        console.log(message.content);
        message.reply(`You said: ${message.content}`);
    } catch (err){
        console.log(err);
    }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("BOT IS ONLINE");