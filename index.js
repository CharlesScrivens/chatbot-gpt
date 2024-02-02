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

client.login(process.env.DISCORD_TOKEN);

