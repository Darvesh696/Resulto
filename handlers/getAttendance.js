'use strict'
require('../config/config');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cheerio = require("cheerio");
const { Markup } = require('telegraf');

const { formatObject, messageReducer, formatDates  } = require('../helpers/Attendance/AttendanceFunctions');

const getArgs = (fn) => fn
	.slice(fn.indexOf('(') + 1, fn.indexOf(')'))
	.match(/([^\s,]+)/g)
	.map(cur => cur.replace(/\"/g, ""))

const sendAttendance = async (ctx) => {
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
		const name = $('#tblStatus > thead:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > h4:nth-child(1) > b:nth-child(1)').text();
		const regNum = $('#tblStatus > thead:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > h4:nth-child(1) > b:nth-child(1)').text();
		const rawData = [];
		$('table tbody tr td').each((i, elem) => {
			rawData[i] = $(elem).text();
		});
		const studentAttendance = rawData.filter(a => Boolean(a));
		const onclickValues = [];
		$('table tr td').each((i, elem) => {
			if (elem.lastChild.attribs && elem.lastChild.attribs.onclick) {
				onclickValues.push(elem.lastChild.attribs.onclick);
			}
		})

		const responses = onclickValues.map(v => getArgs(v).filter(m => Boolean(m)));
		const students = formatObject(studentAttendance);
		await ctx.replyWithHTML(`<b>${name} \n${regNum}</b>\n➖➖➖➖➖➖➖➖➖➖➖➖➖\n `);
		students.forEach(async (std, i) => {
			try {
				await ctx.replyWithHTML(messageReducer(std), Markup.inlineKeyboard([
					Markup.callbackButton("View Absent Dates", responses[i].toString())
				]).extra())
			} catch (error) {
				console.log(error.toString())
			}
		});
		return
	}
}
module.exports.sendAttendance = sendAttendance;