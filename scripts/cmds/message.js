module.exports = {
  name: 'message',
  execute(bot, msg) {
    if (!msg.text.startsWith(bot.config.prefix)) {
      bot.sendMessage(msg.chat.id, `You said: ${msg.text}`);
    }
  }
};
