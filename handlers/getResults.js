const puppeteer = require('puppeteer')
const {formatObject} = require('../helpers/Result/ResultsFormat')
const {getURL} = require('../helpers/Result/ResultFunctions')

const sendResults = async (ctx, next) => {
	let {message:{text:message}} = ctx
	//gets the register number from the {message} with regex expression
	let registerNumber = message.match(/\d{9}/)[0]
	//gets the semester number from the {message} with regex expression
	let semesterNumber = message.match(/\d/)[0]
	if(Number(semesterNumber)<1 || Number(semesterNumber)>5)
		return ctx.reply("Not available. Please choose a number from the list provided, to get the list \nclick here 👉🏼 /start")
	//{getURL} function retuns the URL of the passed semester's results webpage
	const URL = getURL(semesterNumber)
	process.setMaxListeners(Infinity)
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--disable-gpu',
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--single-process'
		],
	})
	const page = await browser.newPage()
	await page.goto(URL, {
		waitUntil: 'networkidle2',
		//timeout: 9000
	})
	//types register number in the input field
	await page.type('.right input', registerNumber),
	await page.click('#btnViewResult')
	//Checks whether page is loaded. If not reply with possible error message
	try{
		await page.waitForSelector("#lblStudentName", { timeout: 1500})
	}catch(error){
		await page.close()
		await browser.close()
		return ctx.reply("SOMETHING WENT WRONG! \n\n1. INVALID REGISTER NUMBER \n2. WEBSITE IS BUSY(UNLIKELY)")
	}
	const studentProfile = await page.evaluate(() => {
		const rowCount = document.querySelectorAll("#gvResults > tbody:nth-child(1) > tr").length
		const name = document.querySelector('#lblStudentName').textContent
		const regNum = document.querySelector('#lblRegisterNumber').textContent
		let subjectScore=[]
		for(let row=2;row<=rowCount;row++){
			subjectScore.push({
				theory : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(4)`).textContent,
				internal : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(5)`).textContent,
				practical : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(6)`).textContent,
				practicalInternal : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(7)`).textContent,
				viva : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(8)`).textContent,
				totalMarks : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(9)`).textContent,
				remarks : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(10)`).textContent,
				subjectName : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(2)`).textContent
			})
		}
		return [
			name,
			regNum,
			...subjectScore
		]
	});
	ctx.replyWithHTML(formatObject(studentProfile));	//closes puppeteer page and browser
	await page.close()
	await browser.close()
}

module.exports.sendResults = sendResults
