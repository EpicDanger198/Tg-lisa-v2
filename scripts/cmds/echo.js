module.exports = {
  name: 'echo',
  description: 'Echo the user message',
  execute(bot, msg, args) {
    if (!args) return bot.sendMessage(msg.chat.id, 'Please provide text to echo.');
    bot.sendMessage(msg.chat.id, args);
  }
};
