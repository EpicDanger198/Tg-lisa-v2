module.exports = {
  name: 'broadcast',
  description: 'Admin-only: broadcast message',
  admin: true,
  async execute(bot, msg, args) {
    if (!args) return bot.sendMessage(msg.chat.id, "Please provide a message.");
    const users = await bot.db.collection('users').find().toArray();
    users.forEach(user => bot.sendMessage(user.userId, `📢 Broadcast: ${args}`));
    bot.sendMessage(msg.chat.id, "Broadcast sent.");
  }
};
