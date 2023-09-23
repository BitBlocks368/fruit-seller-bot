// Load dotenv package, call config method. 
// Used to read the .env file in project root.
// Loads .env values as environment variables.
// Access variables defined in the .env file
// via process.env.VARIABLE_NAME.
require('dotenv').config();

// Import Client and Intents classes from discord.js library.
// Client class used to interact with the Discord API,
// while the Intents class is used to specify which events
// the bot should receive from Discord.
const { Client, Intents } = require('discord.js');

// Create new Intents object and assign to the
// constant intents. This object is constructed with an
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
 
// Create new instance of the Client class, using the intents object
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

// Event listener for the 'messageCreate' event, which is emitted every time
// a new message is sent in any channel the bot has access to. 
client.on('messageCreate', (message) => {
    // 1. Ignore messages from bots to prevent responding to other bots
    //    which could potentially lead to infinite loops of messages between bots.
    if (message.author.bot) return;
    // 2. Log the received message to the console, specifying whether the message
    //    has text content, attachments, or embeds.
    if (message.content) {
        console.log(`Received message: ${message.content} from ${message.author.tag}`);
    } else {
        console.log(`Received a message with no text content from ${message.author.tag}`);    
        // Check if the message has attachments and log them if they exist
        if (message.attachments.size > 0) {
            console.log('Message has attachments:', message.attachments);
        }
        // Check if the message has embeds and log them if they exist
        if (message.embeds.length > 0) {
            console.log('Message has embeds:', message.embeds);
        }
    }
    // 3. Respond to specific messages:
    //    If the content of the received message, converted to lowercase, matches the string 'gm', 
    //    the bot sends a 'GM' message to the same channel where the original message was received.
    if (message.content && message.content.toLowerCase() === 'gm') {
        message.channel.send('GM');
    }
});

// Log client (bot) into Discord using the token stored in the
// TOKEN constant. This begins the connection process and
// once successfully logged in, will trigger the ready event.
client.login(TOKEN);