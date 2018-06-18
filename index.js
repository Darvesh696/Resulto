require("./config/config")
const sendResults = require('./handlers/getResults').sendResults
const Telegraf = require('telegraf')

const bot = new Telegraf(CONFIG.BOT_API_TOKEN)


bot.command('start', (ctx) => ctx.reply('Send semester number followed by your register number.\nFor example: 4 158***601'))
bot.hears(/\d\s\d{9}/, async (ctx) => {
	await sendResults(ctx)
})

bot.startPolling()

