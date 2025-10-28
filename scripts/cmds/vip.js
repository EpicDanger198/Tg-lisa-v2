module.exports = {
  name: 'vipinfo',
  description: 'VIP-only command',
  vip: true,
  execute(bot, msg) {
    bot.sendMessage(msg.chat.id, `Hello VIP! Here's your special info 🌟`);
  }
};
