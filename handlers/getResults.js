const puppeteer = require('puppeteer')

const { log } = console
const FIRST_SEMESTER = CONFIG.FIRST_SEMESTER

const sendResults = async (ctx) => {
	let {message:{text:message}} = ctx
	let regNumber = message.match(/\d{9}/)[0]
	let semesterNumber = message.match(/\d/)[0]
	log(regNumber,semesterNumber)
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		],
	})
	const page = await browser.newPage()
	await page.goto(FIRST_SEMESTER, {
		waitUntil: 'networkidle2'
	})
	await page.type('.right input', regNumber)
	await page.click('#btnViewResult')
	const resultsSelector = 'table'
	await page.waitForSelector(resultsSelector)
	let studentDetails = await page.evaluate(() => {
		let name
		let regNum
		name = document.querySelector('#lblStudentName').innerHTML
		regNum = document.querySelector('#lblRegisterNumber').innerHTML
		return {regNum,name}
	})
	ctx.reply(`${studentDetails.regNum} ${studentDetails.name}`)
}


module.exports.sendResults = sendResults