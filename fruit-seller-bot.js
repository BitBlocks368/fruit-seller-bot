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
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
// Load the messages from JSON files
const gmResponses = JSON.parse(fs.readFileSync('good-morrow-messages.json', 'utf8'));
const gmRepeatResponses = JSON.parse(fs.readFileSync('repeated-good-morrow-messages.json', 'utf8'));
const positiveAffirmations = JSON.parse(fs.readFileSync('positiveAffirmations.json', 'utf8'));
const morningRoutineStoryData = JSON.parse(fs.readFileSync('morningRoutine.json', 'utf8'));

// Function to get a random story sentence
function getRandomStorySentence() {
    const sentenceA = morningRoutineStoryData.sentenceA[Math.floor(Math.random() * morningRoutineStoryData.sentenceA.length)];
    const sentenceB = morningRoutineStoryData.sentenceB[Math.floor(Math.random() * morningRoutineStoryData.sentenceB.length)];
    return `${sentenceA} ${sentenceB}`;
}
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

// Open a SQLite Database.
let db = new sqlite3.Database('./fruit-seller-bot.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the users database.');
  });
    // Create a table to store user IDs and timestamps.
  db.run(`CREATE TABLE IF NOT EXISTS users (userId TEXT PRIMARY KEY, timestamp INTEGER, state INTEGER DEFAULT 0, warned INTEGER)`);

// Set event listener for the ready event.
// This event is emitted when the client becomes ready to start working.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

let responsesCounter = 0;
let gmCounter = 0;

// Event listener for the 'messageCreate' event, which is emitted every time
// a new message is sent in any channel the bot has access to. 
client.on('messageCreate', message => {
    if (message.author.bot) return; // Ignore messages from bots

    if (message.content) {
        console.log(`Received message: ${message.content}. From ${message.author.tag}`);
    } else {
        console.log(`Received a message with no text content from ${message.author.tag}`);
        if (message.attachments.size > 0) {
            console.log('Message has attachments:', message.attachments);
        }
        if (message.embeds.length > 0) {
            console.log('Message has embeds:', message.embeds);
        }
    }

    if (/^gm/i.test(message.content)) {
        const userId = message.author.id;
        const now = Date.now();
        db.get(`SELECT timestamp, state FROM users WHERE userId = ?`, [userId], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const lastTimestamp = row ? row.timestamp : 0;
            const state = row ? row.state : 0;
            if (now - lastTimestamp >= twentyFourHours || !row) {
                message.reply(`GM <@${message.author.id}>! ${gmResponses[gmCounter % gmResponses.length]}`);
                gmCounter++;
                db.run(`REPLACE INTO users (userId, timestamp, state) VALUES (?, ?, ?)`, [userId, now, 1]);
            } else {
                switch (state) {
                    case 1: // Initial GM state
                        if (message.content.toLowerCase().includes(`gm <@${client.user.id}>`)) {
                            message.reply(positiveAffirmations[Math.floor(Math.random() * positiveAffirmations.length)]);
                            db.run(`UPDATE users SET state = 2 WHERE userId = ?`, [userId]);
                        }
                        break;
                    case 2: // GM targeted at bot state
                        message.reply(gmRepeatResponses[gmCounter % gmRepeatResponses.length]);
                        gmCounter++;
                        db.run(`UPDATE users SET state = 3 WHERE userId = ?`, [userId]);
                        break;
                    case 3: // After receiving repeated GM
                        // All further GMs are ignored
                        break;
                }
            }
        });
    }

    // The "tell me about your day" mention check
    if (message.mentions.users.has(client.user.id)) {
        const withoutMention = message.content.replace(/<@!?[0-9]+>/, '').trim();
        if (withoutMention.toLowerCase() === 'tell me about your day') {
            message.reply(`I'll tell you a little of my day. ${getRandomStorySentence()}`);
        }
    }
});

// client.once('ready', () => {
//    
//     console.log('Bot is ready!');    // Fetch the guild by ID (replace YOUR_GUILD_ID with the actual guild ID)
//     const guild = client.guilds.cache.get('863981449912123393');
//
//     Check if the guild exists
//     
//     if (guild) {
//         // Get a list of all channels in the guild
//         const channels = guild.channels.cache.map(channel => `${channel.name} (${channel.id})`);
//         // Log the list of channels
//         console.log('List of channels:', channels.join(', '));
//         }
//    
//     // Set an interval to send a message every 10 sec
//     const tenSec = 10 * 1000; 
//     setInterval(() => {
//         const channelName = 'the-moss'; 
//         const channel = guild.channels.cache.find(ch => ch.name === channelName && ch.type === 'text');
// 
//         if (channel) {
//             console.log('Found the channel:', channelName);
//             
//             if (channel.isText()) {
//                 channel.send(getRandomStorySentence());
//                 console.log('Message sent to the channel.');
//             } else {
//                 console.log('The channel is not a text channel.');
//            }
//        } else {
//             console.log(`Channel with name ${channelName} not found.`);
//         }
//     }, tenSec);
// });

// Log client (bot) into Discord using the token stored in the
// TOKEN constant. This begins the connection process and
// once successfully logged in, will trigger the ready event.
client.login(TOKEN);