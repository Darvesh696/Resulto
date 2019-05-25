require('./config/config');
const { sendAttendance } = require('./handlers/getAttendance');
const Telegraf = require('telegraf');

const bot = new Telegraf(CONFIG.BOT_API_TOKEN);

bot.command('start', (ctx) => ctx.reply(`
	Choose Anyone for more details
	  Send Your Register Number
	  **Created by @solooo7**
`));

bot.command('attendance', (ctx) => ctx.reply(`
	Please Send Me Your Register Number
`));

bot.on('text', async (ctx, next)=>{
	if(/\d{6}/.test(ctx.message.text)){
		console.time("Full time: ")
		await sendAttendance(ctx, next);
		console.timeEnd("Full time: ")
	}else{
		ctx.reply("Invalid Number")
	}
});

bot.startPolling();
