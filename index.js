require('./config/config')
const sendResults = require('./handlers/getResults').sendResults
const Telegraf = require('telegraf')


const express = require('express')
const app = express()

const bot = new Telegraf(CONFIG.BOT_API_TOKEN)

bot.telegram.setWebhook(`${CONFIG.URL}/bot${CONFIG.BOT_API_TOKEN}`)
app.use(bot.webhookCallback(`/bot${CONFIG.BOT_API_TOKEN}`))



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

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(CONFIG.PORT, () => {
	console.log(`Server running on port ${CONFIG.PORT}`)
})