const puppeteer = require('puppeteer')
const {getURL} = require('../helpers/index')

const sendResults = async (ctx) => {
	let {message:{text:message}} = ctx
	//gets the register number from the {message} with regex expression
	let registerNumber = message.match(/\d{9}/)[0]
	//gets the semester number from the {message} with regex expression
	let semesterNumber = message.match(/\d/)[0]
	if( Number(semesterNumber)<1 || Number(semesterNumber)>5)
		return ctx.reply("Not available. Please choose a number from the list provided, to get the list \nclick here 👉🏼 /start")
	//{getURL} function retuns the URL of the passed semester's results webpage
	const URL = await getURL(semesterNumber)
	console.log(registerNumber)
	process.setMaxListeners(Infinity);
	console.time('testForEach');
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--disable-gpu',
			// '--no-sandbox',
			// '--disable-setuid-sandbox',
			// '--disable-dev-shm-usage',
			// '--single-process',
		],
	})
	const page = await browser.newPage()
	await page.goto(URL, {
		waitUntil: 'networkidle2',
		timeout: 8500
	})
	//types register number in the input field
	await page.type('.right input', registerNumber),
	await page.click('#btnViewResult')
	//Checks whether page is loaded. If not replied with possible error message
	try{
		await page.waitForSelector("#lblStudentName", { timeout: 500})
	}catch(error){
		await page.close()
		await browser.close()
		return ctx.reply("SOMETHING WENT WRONG! \n1. INVALID REGISTER NUMBER \n2. WEBSITE IS BUSY(UNLIKELY)")
	}
	const studentProfile = await page.evaluate(() => {
		const rowCount = document.querySelectorAll("#gvResults > tbody:nth-child(1) > tr").length
		const name = document.querySelector('#lblStudentName').textContent
		const regNum = document.querySelector('#lblRegisterNumber').textContent
		let subjectScore=[]
		for(let row=2;row<=rowCount;row++){
			subjectScore.push({
				THMarks : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(4)`).textContent,
				INMarks : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(5)`).textContent,
				PRMarks : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(6)`).textContent,
				PRINMarks : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(7)`).textContent,
				VIVAMarks : document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(8)`).textContent,
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
	})

	console.log(JSON.stringify(studentProfile,null,2))
	ctx.reply(studentProfile)
	//closes puppeteer page and browser
	await page.close()
	await browser.close()
}

module.exports.sendResults = sendResults