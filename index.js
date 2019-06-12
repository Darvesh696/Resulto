'use strict'
require('./config/config');
const { sendAttendance } = require('./handlers/getAttendance');
const Telegraf = require('telegraf');
const cheerio = require("cheerio");
const qs = require("qs");
const fetch = require('node-fetch');
const { formatDates } = require('./helpers/Attendance/AttendanceFunctions')

const bot = new Telegraf(CONFIG.BOT_API_TOKEN);

bot.command('start', (ctx) => ctx.reply(`
	Send your register number
`));

bot.command('attendance', (ctx) => ctx.reply(`
	Please Send Me Your Register Number
`));

bot.on('text', async (ctx, next)=>{
	if(/\d{6}/.test(ctx.message.text)){
		console.log(ctx.message.text);
		console.time("Full time: ");
		await sendAttendance(ctx, next);
		console.timeEnd("Full time: ");
	}else{
		ctx.reply("Invalid Number");
	}
});

bot.action(/(.*?)/, async ctx => {
	const [tabname, regno] = ctx.update.callback_query.data && ctx.update.callback_query.data.split(',');
	const body = { tabname, regno }

	const response = await fetch(`https://www.sac-aimit.in/cas/absentdates.php`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
		body: qs.stringify(body)
	})
	.then(res => res.text());

	const datePage = await response;
	const datesHTML = cheerio.load(datePage, {
		normalizeWhitespace: true
	});
	const absentDates = datesHTML('center >b').text();
	ctx.answerCbQuery(formatDates(absentDates), true);
})

bot.startPolling();
