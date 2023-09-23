// Load dotenv package, call config method. 
// Used to read the .env file in project root.
// Loads .env values as environment variables.
// As a result, you can access variables defined in the .env file
// via process.env.VARIABLE_NAME.
require('dotenv').config();

// Import Client and Intents classes from discord.js library.
// The Client class is used to interact with the Discord API,
// while the Intents class is used to specify which events
// your bot should receive from Discord.
const { Client, Intents } = require('discord.js');

// Create new Intents object and assign to the
// constant myIntents. This object is constructed with an
// array of intent flags that specify the types of events
// the bot client should listen for:
// Intents.FLAGS.GUILDS allows the bot to receive events related to
// Discord servers (guilds), like joining or leaving a server.
// Intents.FLAGS.GUILD_MESSAGES allows the bot to receive message
// events in servers (i.e., when a message is sent in a server the
// bot is in).
// List the intents your bot needs:
 const intents = new Intents([
     Intents.FLAGS.GUILDS,
     Intents.FLAGS.GUILD_MESSAGES
 ]);

// const intents = new Intents();
// intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

// Create new instance of the Client class, using the myIntents object
// created earlier to inform Discord which events the bot is 
// interested in receiving. This client object is your gateway to
// interacting with the Discord API. It can be used to log in to
// Discord, listen for events, send messages, and more.
const client = new Client({ intents: intents });

// Set the TOKEN constant to the value of 
// DISCORD_BOT_TOKEN environment variable, 
// loaded from your .env file using dotenv.
const TOKEN = process.env.DISCORD_BOT_TOKEN;

// Set event listener for the ready event.
// This event is emitted when the client becomes ready to start working.
// When event is triggered, it will log to the console the tag
// (username and discriminator, e.g., BotName#1234) of the bot.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Set event listener for the message event.
// Emitted every time a new message is sent in any channel.
// Bot can view the message.
// The function checks:
// 1. If author of message is a bot (message.author.bot).
// If it is, it immediately exits to prevent responding to other bots.
// 2. If the message content, when converted to lowercase,
// exactly matches the string 'gm'. 
// If it does, the bot sends 'GM' to the same channel
// where the original message was sent.
// client.on('messageCreate', message => {
    // console.log(`Received message: ${message.content} from ${message.author.tag}`);
    // console.log(`Message content: ${message.content}`); // Logging only the message content
    // if (message.author.bot) return; // Ignore messages from bots
    // if (message.content.toLowerCase() === 'gm') {
    //     message.channel.send('GM'); // Send 'GM' to the same channel where the message was received
    // }
// });

 client.on('messageCreate', (message) => {
     if (message.author.bot) return; // Ignore messages from bots
     
     if (message.content) {
         console.log(`Received message: ${message.content} from ${message.author.tag}`);
     } else {
         console.log(`Received a message with no text content from ${message.author.tag}`);
         if (message.attachments.size > 0) {
             console.log('Message has attachments:', message.attachments);
         }
         if (message.embeds.length > 0) {
             console.log('Message has embeds:', message.embeds);
         }
     }
     
     if (message.content && message.content.toLowerCase() === 'gm') {
         message.channel.send('GM'); // Send 'GM' to the same channel where the message was received
     }
 });

// Log client (bot) into Discord using the token stored in the
// TOKEN constant. This begins the connection process and
// once successfully logged in, will trigger the ready event.
client.login(TOKEN);