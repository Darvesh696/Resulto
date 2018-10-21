require('../config/config');
const puppeteer = require('puppeteer');

const { formatMessage } = require('../helpers/AttendanceFormat');

const URL = String(CONFIG.ATTENDANCEURL);
const sendAttendance = async (ctx, page, next) => {
	let { message: { text: message } } = ctx
	//gets the register number from the {message} with regex expression
	let registerNumber = message.match(/\d{6}/)[0]
	process.setMaxListeners(Infinity)
	// const browser = await puppeteer.launch({
	// 	headless: true,
	// 	args: [
	// 		 '--disable-gpu',
	// 		 '--no-sandbox',
	// 		 '--disable-setuid-sandbox',
	// 		// '--disable-dev-shm-usage',
	// 		//'--single-process'
	// 	],
	// })
	// const page = await browser.newPage()
	await page.goto(URL, {
		waitUntil: 'networkidle2',
		//timeout: 9000
	})
	//types register number in the input field
	await page.type('#myForm > table > tbody > tr:nth-child(1) > td:nth-child(2) > input', registerNumber),
	await page.click('#myForm > table > tbody > tr:nth-child(2) > td:nth-child(1) > input')
	//Checks whether page is loaded. If not reply with possible error message
	try{
		await page.waitForSelector("#myForm > h3:nth-child(3) > b", { timeout: 1500})
	}catch(error){
		await page.close()
		await browser.close()
		return ctx.reply("SOMETHING WENT WRONG! \n\n1. INVALID REGISTER NUMBER \n2. WEBSITE IS BUSY(UNLIKELY)")
	}

	const studentProfile = await page.evaluate(() => {
		name = document.querySelector('#myForm > h3:nth-child(3) > b').textContent;
		regNum = document.querySelector('#myForm > h3:nth-child(2) > b').textContent;
		return { name,regNum };
	});

	const studentAttendance = await page.evaluate(() => {
		name = document.querySelector('#myForm > h3:nth-child(3) > b').textContent;
		regNum = document.querySelector('#myForm > h3:nth-child(2) > b').textContent;
		const tds = Array.from(document.querySelectorAll('table tr td'));
		return tds.map(td => td.textContent).filter(Boolean);
	});
	console.log(studentAttendance);
	ctx.replyWithHTML(formatMessage(studentAttendance,studentProfile.name,studentProfile.regNum));

	
	//closes puppeteer page and browser
	await page.close()
	//await browser.close()
}

module.exports.sendAttendance = sendAttendance
