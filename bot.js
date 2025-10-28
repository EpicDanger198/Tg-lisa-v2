const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { MongoClient } = require('mongodb');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const bot = new TelegramBot(token, { polling: true });
bot.config = config;

// MongoDB connection
let dbClient;
(async () => {
  try {
    dbClient = new MongoClient(config.mongodb.uri);
    await dbClient.connect();
    bot.db = dbClient.db();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})();

console.log(`${config.botName} (${config.nickname}) is running...`);

// Load commands
bot.commands = new Map();
const cmdsPath = path.join(__dirname, 'scripts', 'cmds');
fs.readdirSync(cmdsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const cmd = require(path.join(cmdsPath, file));
    bot.commands.set(cmd.name, cmd);
  }
});

// Command handler with prefix
bot.onText(new RegExp(`^\\${config.prefix}(\\w+)(?:\\s+(.+))?`), async (msg, match) => {
  const userId = msg.from.id;
  const commandName = match[1].toLowerCase();
  const args = match[2];
  const command = bot.commands.get(commandName);

  if (!command) return;

  if (command.admin && !config.adminUID.includes(userId))
    return bot.sendMessage(msg.chat.id, "Only admins can use this command.");
  if (command.vip && !config.vipUID.includes(userId) && !config.adminUID.includes(userId))
    return bot.sendMessage(msg.chat.id, "Only VIPs can use this command.");

  try {
    await command.execute(bot, msg, args);

    if (bot.db) {
      await bot.db.collection('commandLogs').insertOne({
        userId,
        username: msg.from.username,
        command: commandName,
        args: args || null,
        date: new Date()
      });
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, "Error executing command.");
  }
});

// Load events
const eventsPath = path.join(__dirname, 'scripts', 'events');
fs.readdirSync(eventsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const event = require(path.join(eventsPath, file));
    bot.on(event.name, (...args) => event.execute(bot, ...args));
  }
});

// Inline button callback
bot.on('callback_query', async (query) => {
  const msg = query.message;
  const data = query.data;

  if (data.startsWith('help_')) {
    const cmdName = data.split('_')[1];
    const command = bot.commands.get(cmdName);
    if (command) {
      await bot.sendMessage(msg.chat.id, `/${cmdName} - ${command.description}`);
    }
    bot.answerCallbackQuery(query.id);
  }
});

// Uptime interval logging
setInterval(() => {
  const uptime = process.uptime();
  console.log(`${config.botName} uptime: ${Math.floor(uptime)} seconds`);
}, 60000);bot.onText(new RegExp(`^\\${config.prefix}(\\w+)(?:\\s+(.+))?`), (msg, match) => {
  const commandName = match[1].toLowerCase();
  const args = match[2];
  const command = bot.commands.get(commandName);
  if (command) command.execute(bot, msg, args);
});

// Load events
const eventsPath = path.join(__dirname, 'scripts', 'events');
fs.readdirSync(eventsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const event = require(path.join(eventsPath, file));
    bot.on(event.name, (...args) => event.execute(bot, ...args));
  }
});

// Handle inline buttons (callback queries)
bot.on('callback_query', (query) => {
  const msg = query.message;
  const data = query.data;

  if (data.startsWith('help_')) {
    const cmdName = data.split('_')[1];
    const command = bot.commands.get(cmdName);
    if (command) {
      bot.sendMessage(msg.chat.id, `/${cmdName} - ${command.description}`);
    }
    bot.answerCallbackQuery(query.id);
  }
});

// Uptime message
setInterval(() => {
  const uptime = process.uptime();
  console.log(`${config.botName} uptime: ${Math.floor(uptime)} seconds`);
}, 60000);
