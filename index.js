// Goal: Create a discord bot with the OpenAI API
require('dotenv/config');
const { Client } = require(`discord.js`);
const { OpenAI } = require(`openai`);

const client = new Client({
    intents: [`Guilds`, `GuildMembers`, `GuildMessages`, `MessageContent`]
});

client.on(`ready`, () => {
    console.log(`The bot is on`);
});

//to ignore stuff
const IGNORE_PREFIX = "!";
const CHANNELS = [`1202769547048788008`];

// define openai 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})

//check that its listening
client.on(`messageCreate`, async(message) => {
    // console.log(message.content);
    // check if responding to bot, if ignore is on, or if it's in right channel before responding
    // and needs to ping the bot
    if (message.author.bot) return;
    if (message.content.startsWith(IGNORE_PREFIX)) return;
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

    const response = await openai.chat.completions.create({
        model: `gpt-3.5-turbo`,
        messages: [
            {
                // name: 
                role: `system`,
                content: `Chat GPT is a friendly chatbot.`,
            },
            {
                // name: 
                role: `user`,
                content: message.content,
            }
        ]
    })
});


client.login(process.env.DISCORD_TOKEN);

