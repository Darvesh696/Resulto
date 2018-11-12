'use strict'
require('../config/config');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { JSDOM } = require('jsdom');
const { formatMessage } = require('../helpers/Attendance/AttendanceFormat');

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
	const { window: { document } } = new JSDOM(pageContent);

	if (document.querySelectorAll('table tr').length<1){
		ctx
			.reply(`OOPS! SOMETHING WENT WRONG! \
				\n\n1. INVALID REGISTER NUMBER \
				\n2. WEBSITE IS BUSY(UNLIKELY)`);
	}else{
		const name = document
			.querySelector('#myForm > h3:nth-child(3) > b')
			.textContent;
		const regNum = document
			.querySelector('#myForm > h3:nth-child(2) > b')
			.textContent;
		const studentAttendance = Array
			.from(document
			.querySelectorAll('table tr td'))
			.map(td => td.textContent)
			.filter(Boolean);
		ctx.replyWithHTML(formatMessage(studentAttendance, name, regNum));
	}
}

module.exports.sendAttendance = sendAttendance;