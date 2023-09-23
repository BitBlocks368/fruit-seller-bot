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
  db.run(`CREATE TABLE IF NOT EXISTS users (userId TEXT, timestamp INTEGER)`);

// Set event listener for the ready event.
// This event is emitted when the client becomes ready to start working.
// When event is triggered, it will log to the console the tag
// (username and discriminator, e.g., BotName#1234) of the bot.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Event listener for the 'messageCreate' event, which is emitted every time
// a new message is sent in any channel the bot has access to. 
cclient.on('messageCreate', message => {
    if (message.author.bot) return;
    
    if (message.content.toLowerCase() === 'gm') {
      const userId = message.author.id;
      const now = Date.now();
  
      // Fetch the last timestamp from the database for the user.
      db.get(`SELECT timestamp FROM users WHERE userId = ?`, [userId], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const lastTimestamp = row ? row.timestamp : 0;
        
        if (now - lastTimestamp >= twentyFourHours) {
          message.channel.send('Good morrow, dear friend!');
          // Update or insert the new timestamp to the database.
          db.run(`REPLACE INTO users (userId, timestamp) VALUES (?, ?)`, [userId, now]);
        } else {
          message.channel.send('Patience, dear heart. Let us meet again on the morrow with fresh smiles!');
        }
      });
    }
  });

// Log client (bot) into Discord using the token stored in the
// TOKEN constant. This begins the connection process and
// once successfully logged in, will trigger the ready event.
client.login(TOKEN);