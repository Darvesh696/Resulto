require("./config/config")
const sendResults = require('./handlers/getResults').sendResults
const Telegraf = require('telegraf')

const bot = new Telegraf(CONFIG.BOT_API_TOKEN)

bot.command('start', (ctx) => ctx.reply(`
1 => 2015 NOV
2 => 2016 DEC
3 => 2017 MAY-JUNE
4 => 2017 AUG-NOV-DEC 
5 => 2018 MAY-JUNE

Select A NUMBER and send me the NUMBER followed by your REGISTER NUMBER
Example: 
\t\t\t\t3 <your register number>`))


bot.hears(/\d\s\d{9}/, async (ctx) => {
	await sendResults(ctx)
})

bot.startPolling()

