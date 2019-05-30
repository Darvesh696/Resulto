'use strict'
require('../config/config');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cheerio = require("cheerio");
const qs = require("qs");
const { Markup } = require('telegraf');

const { formatObject, messageReducer, formatDates  } = require('../helpers/Attendance/AttendanceFunctions');

const getArgs = (fn) => fn
	.slice(fn.indexOf('(') + 1, fn.indexOf(')'))
	.match(/([^\s,]+)/g)
	.map(cur => cur.replace(/\"/g, ""))

const sendAttendance = async (ctx, next) => {
	const registerNumber = ctx.message.text.match(/\d{6}/)[0]
	const form = new FormData();
	form.append('txtRegno', registerNumber);
	form.append('btnadd', 'Search');
	const response = await fetch(CONFIG.ATTENDANCEURL, {
		method: 'POST',
		body: form
	});
	const pageContent = await response.text();
	const $ = cheerio.load(pageContent, {
		normalizeWhitespace: true
	});
	const rawData = [];
	if ($('table tr td').length < 1) {
		return ctx
			.reply(`OOPS! SOMETHING WENT WRONG! \
				\n\n1. INVALID REGISTER NUMBER \
				\n2. WEBSITE IS BUSY(UNLIKELY)`);
	} else {
		const name = $('#myForm > h3:nth-child(3) > b').text();
		const regNum = $('#myForm > h3:nth-child(2) > b').text();
		const rawData = [];
		$('table tr td').each( (i, elem) => {
			rawData[i] = $(elem).text();
		});
		const studentAttendance = rawData.filter(a => Boolean(a));
		const onclickValues = [];
		$('table tr td').each((i, elem) =>{
			if(elem.lastChild.attribs && elem.lastChild.attribs.onclick){
				onclickValues.push(elem.lastChild.attribs.onclick);
			}
		})

		const responses = onclickValues.map(async v => {
			const arg = getArgs(v).filter(m => Boolean(m));
			const body = { tabname: arg[0], regno: arg[1]}
			const res = await fetch(`https://www.sac-aimit.in/cas/absentdates.php`,{
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
				body: qs.stringify(body)
			})
			.then(res => res.text())
			return res
		})
		const rawDates = await Promise.all(responses);
		const datesHTML = rawDates.map(date => {
			return cheerio.load(date, {
				normalizeWhitespace: true
			});
		});
		
		const alldates = datesHTML.map(d => d('center >b').text())
		const dates = alldates.map(d => d.replace(/\/2019/g, ""))

		
		ctx.replyWithHTML(`<b>${name} \n${regNum}</b>\n➖➖➖➖➖➖➖➖➖➖➖➖➖\n `);
		const students = formatObject(studentAttendance);
		
		students.forEach(async (std, i) => {
			try {
				console.log(formatDates(dates[i]).length)
				console.log(formatDates(dates[i]))
				await ctx.replyWithHTML(messageReducer(std))
				await ctx.replyWithHTML("Dates",Markup.inlineKeyboard([
					Markup.callbackButton("View", formatDates(dates[i]))
				]).extra())
			}catch (error) {
				console.log(formatDates(dates[i]).length)
				console.log(error.toString())
			}
		});
	
		return 
	}
}
module.exports.sendAttendance = sendAttendance;