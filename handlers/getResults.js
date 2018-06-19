const puppeteer = require('puppeteer')

const FIRST_SEMESTER = CONFIG.FIRST_SEMESTER




const sendResults = async (ctx) => {
	let {message:{text:message}} = ctx
	let regNumber = message.match(/\d{9}/)[0]
	let semesterNumber = message.match(/\d/)[0]
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
	let rowCount
	let countArray = []
	let studentDetails = await page.evaluate(() => {
		let name
		let regNum
		rowCount = document.querySelectorAll("#gvResults > tbody:nth-child(1) > tr").length
		//CREATES ARRAY FROM 1 TO rowCount.
		countArray = Array.from({ length: rowCount}, (v, k) => k + 1).splice(1)
		name = document.querySelector('#lblStudentName').innerHTML
		regNum = document.querySelector('#lblRegisterNumber').innerHTML
		let subjectScore =[]
		countArray.map(row => {
			let marks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(2)`).textContent
			let name = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(4)`).textContent
			subjectScore.push({
				subjectName: name,
				marks: marks
			})
		})
		return {
			regNum,
			name,
			countArray
		}
	})
	let results = await page.evaluate(() => {
		let subjectScore = []
		countArray.map(row => {
			let THMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(4)`).textContent || ''
			let INMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(5)`).textContent || ''
			let PRMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(6)`).textContent || ''
			let PRINMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(7)`).textContent || ''
			let totalMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(9)`).textContent
			let subjectName = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(2)`).textContent
			subjectScore.push({
				subjectName,
				totalMarks,
				THMarks,
				INMarks,
				PRMarks,
				PRINMarks
			})
		})
		return subjectScore
	})
	let structuredData = await structureData(studentDetails,results)
	ctx.reply(structuredData )
	await page.close()
	await browser.close()
}

let structureData = (studentDetails, data) => {
	let count = studentDetails.countArray
	let fullData
	return new Promise((resolve) => {
		fullData = `${studentDetails.name} \n${studentDetails.regNum} \n\n`
		let theory
		let internal
		count.map((r, i) => {
			(Number(data[i].THMarks) === 0 && Number(data[i].INMarks) === 0) ?
				((theory = `${data[i].PRMarks} +`) && (internal=data[i].PRINMarks )) :
				(Number(data[i].THMarks) === 0 ?
					((theory=data[i].INMarks) && (internal="")) :
					((theory = data[i].THMarks) && (internal = data[i].INMarks)))
			fullData = fullData + `${data[i].subjectName} \n  ${theory} ${internal} = ${data[i].totalMarks} \n\n`
		})
		resolve(fullData)
	})
}

module.exports.sendResults = sendResults