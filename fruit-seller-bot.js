const { Client } = require('discord.js');
const client = new Client();

const TOKEN = 'DISCORD_BOT_TOKEN'; // Replace with your bot token

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === 'gm') {
        message.channel.send('GM');
    }
});

client.login(TOKEN);
