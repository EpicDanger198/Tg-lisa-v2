module.exports = {
  name: 'help',
  description: 'List all commands with buttons',
  execute(bot, msg) {
    const commands = Array.from(bot.commands.keys());

    const buttons = commands.map(cmd => ([{
      text: `/${cmd}`,
      callback_data: `help_${cmd}`
    }]));

    bot.sendMessage(msg.chat.id, 'Available commands:', {
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  }
};
