module.exports = {
  name: 'message',
  execute(bot, msg) {
    if (msg.text === '/uptime') {
      const uptime = process.uptime();
      bot.sendMessage(msg.chat.id, `Bot uptime: ${Math.floor(uptime)} seconds`);
    }
  }
};
