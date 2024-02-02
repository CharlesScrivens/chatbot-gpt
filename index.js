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

    // looks like the bot is typing
    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
    }, 5000);

    // logs of convos
    let conversation = [];
    
    conversation.push({
        role: `system`,
        content: `Chat GPT is a snarky chatbot.`,
    });

    let prevMessages = await message.channel.messages.fetch({ limit: 10});
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (message.author.bot && msg.user.id !== client.user.id) return;
        if (message.content.startsWith(IGNORE_PREFIX)) return;

        const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        if (msg.author.id === client.user.id) {
            conversation.push({
                role: 'assistant',
                name: username,
                content: msg.content,
            });

            return;
        }

        conversation.push({
            role: `user`,
            name: username,
            content: msg.content,
        });


    })

    const response = await openai.chat.completions.create({
        model: `gpt-3.5-turbo`,
        messages: conversation,
    })
    .catch((error) => console.error(`Open AI Error:\n`, error));

    clearInterval(sendTypingInterval); // stops the typing message

    // if response not received
    if (!response) {
        message.reply("I'm having trouble with the OpenAI API");
        return;
    }

    const responseMessage = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    for (let i = 0; i < chunkSizeLimit; i += chunkSizeLimit) {
        const chunk = responseMessage.substring(i, i + chunkSizeLimit);

        await message.reply(chunk);
    }
    
});


client.login(process.env.DISCORD_TOKEN);

