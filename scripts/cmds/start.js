module.exports = {
  name: 'start',
  description: 'Send welcome message',
  execute(bot, msg) {
    bot.sendMessage(msg.chat.id, `Hello ${msg.from.first_name}! Welcome to ${bot.config.botName} (${bot.config.nickname}).`);
  }
};
